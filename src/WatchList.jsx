import React, { useState, useContext, useEffect, useRef } from "react";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHorizOutlined,
  Close,
} from "@mui/icons-material";

import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";
import Doughnut from "./doughnut1";
import GeneralContext from "./generalContext";
import socket from "./socket";
import api from "./api";
import "./WatchList.css";

const WatchList = () => {
  const [watchlistEntries, setWatchlistEntries] = useState([]); // [{ _id, name }]
  const [livePrices, setLivePrices] = useState({}); // { name: { price, percent, isDown } }
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef(null);

  const fetchWatchlist = () => {
  if (!localStorage.getItem("token")) return;

  api
    .get("/watchlist")
    .then((res) => setWatchlistEntries(res.data))
    .catch(() => {});
};

  useEffect(() => {
    fetchWatchlist();

    const handlePriceUpdate = (prices) => {
      const priceMap = {};
      prices.forEach((p) => {
        priceMap[p.name] = p;
      });
      setLivePrices(priceMap);
    };

    socket.on("priceUpdate", handlePriceUpdate);
    return () => socket.off("priceUpdate", handlePriceUpdate);
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      api
        .get(`/stocks/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => setSearchResults(res.data))
        .catch(() => setSearchResults([]));
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  const handleAddStock = (stockName) => {
    api
      .post("/watchlist/add", { name: stockName })
      .then(() => {
        fetchWatchlist();
        setSearchQuery("");
        setShowDropdown(false);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to add stock");
      });
  };

  const handleRemoveStock = (id) => {
    api
      .delete(`/watchlist/remove/${id}`)
      .then(() => fetchWatchlist())
      .catch(() => alert("Failed to remove stock"));
  };

  const stocksWithPrices = watchlistEntries.map((entry) => {
    const live = livePrices[entry.name];
    return {
      _id: entry._id,
      name: entry.name,
      price: live ? live.price : 0,
      percent: live ? live.percent : "0.00%",
      isDown: live ? live.isDown : false,
    };
  });

  const chartData = {
    labels: stocksWithPrices.map((s) => s.name),
    datasets: [
      {
        label: "Price",
        data: stocksWithPrices.map((s) => s.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        />
        <span className="counts">{stocksWithPrices.length} / 50</span>

        {showDropdown && searchQuery.trim() && (
          <div className="search-dropdown">
            {searchResults.length === 0 ? (
              <div className="search-dropdown-empty">No matching stocks found</div>
            ) : (
              searchResults.map((stock) => (
                <div
                  key={stock.name}
                  className="search-dropdown-item"
                  onMouseDown={() => handleAddStock(stock.name)}
                >
                  <span>{stock.name}</span>
                  <span className="full-name">{stock.fullName}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ul className="list">
        {stocksWithPrices.map((stock) => (
          <WatchListItem key={stock._id} stock={stock} onRemove={() => handleRemoveStock(stock._id)} />
        ))}
      </ul>

      {stocksWithPrices.length > 0 && <Doughnut data={chartData} />}
    </div>
  );
};

const WatchListItem = ({ stock, onRemove }) => {
  const [showWatchListAction, setShowWatchListAction] = useState(false);

  const handleMouseEnter = () => setShowWatchListAction(true);
  const handleMouseLeave = () => setShowWatchListAction(false);

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price.toFixed(2)}</span>
        </div>
      </div>
      {showWatchListAction && (
        <WatchListActions uid={stock.name} onRemove={onRemove} />
      )}
    </li>
  );
};

const WatchListActions = ({ uid, onRemove }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openOrderWindow(uid, "BUY");
  };

  const handleSellClick = () => {
    generalContext.openOrderWindow(uid, "SELL");
  };

  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (b)" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" onClick={handleBuyClick}>Buy</button>
        </Tooltip>
        <Tooltip title="Sell (s)" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" onClick={handleSellClick}>Sell</button>
        </Tooltip>
        <Tooltip title="Analytics" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="Remove from watchlist" placement="top" arrow TransitionComponent={Grow}>
          <button className="remove-btn" onClick={onRemove}>
            <Close style={{ fontSize: "18px" }} />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};

export default WatchList;