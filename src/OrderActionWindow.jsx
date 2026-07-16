import React, { useState, useContext, useEffect } from "react";
import GeneralContext from "./generalContext";
import api from "./api";
import socket from "./socket";
import "./OrderActionWindow.css";

const OrderActionWindow = ({ uid, mode }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [product, setProduct] = useState("CNC");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { closeOrderWindow } = useContext(GeneralContext);

  const isSell = mode === "SELL";

  useEffect(() => {
    const handlePriceUpdate = (livePrices) => {
      const match = livePrices.find((s) => s.name === uid);
      if (match) {
        setStockPrice(match.price);
      }
    };

    socket.on("priceUpdate", handlePriceUpdate);
    return () => socket.off("priceUpdate", handlePriceUpdate);
  }, [uid]);

  const handleSubmitClick = async () => {
    setError("");

    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!qty || qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (!price || price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/newOrder", { name: uid, qty, price, mode, product });
      closeOrderWindow();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
      setSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    closeOrderWindow();
  };

  return (
    <div id="order-window">
      <div className="order-container">
        <div className={`header ${isSell ? "header-sell" : "header-buy"}`}>
          <h3>
            {isSell ? "Sell" : "Buy"} {uid}
          </h3>
        </div>

        <div className="regular-order">
          <div className="product-toggle">
            <button
              type="button"
              className={product === "CNC" ? "product-btn active" : "product-btn"}
              onClick={() => setProduct("CNC")}
            >
              CNC (Delivery)
            </button>
            <button
              type="button"
              className={product === "MIS" ? "product-btn active" : "product-btn"}
              onClick={() => setProduct("MIS")}
            >
              MIS (Intraday)
            </button>
          </div>

          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <input
                type="number"
                min="1"
                onChange={(e) => setStockQuantity(e.target.value)}
                value={stockQuantity}
              />
            </fieldset>
            <fieldset>
              <legend>Price</legend>
              <input
                type="number"
                step="0.01"
                min="0"
                onChange={(e) => setStockPrice(e.target.value)}
                value={stockPrice}
              />
            </fieldset>
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="buttons">
          <span>
            {isSell ? "Est. proceeds" : "Margin required"} ₹
            {(stockQuantity * stockPrice).toFixed(2)}
          </span>
          <div>
            <button
              className={`btn ${isSell ? "btn-red" : "btn-blue"}`}
              onClick={handleSubmitClick}
              disabled={submitting}
            >
              {submitting ? "Placing..." : isSell ? "Sell" : "Buy"}
            </button>
            <button className="btn btn-grey" onClick={handleCancelClick} disabled={submitting}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderActionWindow;