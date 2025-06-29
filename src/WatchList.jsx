import React, { useState } from "react";
import { BarChartOutlined, KeyboardArrowDown, KeyboardArrowUp, MoreHorizOutlined } from "@mui/icons-material";
import { watchlist } from "./Data/data";

import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";
const WatchList = () => {
  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts">{watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => (
          <WatchListItem key={index} stock={stock} />
        ))}
      </ul>
    </div>
  );
};

const WatchListItem = ({ stock }) => {
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
          <span className="price">{stock.price}</span>
        </div>

      </div>
      {showWatchListAction && <WatchListAction uid={stock.name}/> }
    </li>
  );
};




export default WatchList;
const WatchListAction=({uid})=>{
  return <span className="actions">
    <span>
      <Tooltip title="Buy (b)" placement="top" arrow TransitionComponent={Grow}>
        <button className="buy ">Buy</button>
      </Tooltip>
       <Tooltip title="Sell (s)" placement="top" arrow TransitionComponent={Grow}>
        <button className="sell ">Sell</button>
      </Tooltip>
       <Tooltip title="Analytics" placement="top" arrow TransitionComponent={Grow}>
        <button className="action"><BarChartOutlined className="icon"/></button> 
      </Tooltip>
      <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
        <button className="action " ><MoreHorizOutlined className="icon " /></button> 
      </Tooltip> 
    </span>

  </span>
}
