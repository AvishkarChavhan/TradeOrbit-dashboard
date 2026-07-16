import React, { useState, useEffect } from "react";
import api from "./api";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/allPositions")
      .then((res) => {
        setAllPositions(res.data);
      })
      .catch(() => {
        setError("Failed to load positions. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // <-- critical fix: empty dependency array so this runs once, not on every render

  if (loading) {
    return <p>Loading positions...</p>;
  }

  if (error) {
    return <p style={{ color: "#d9363e" }}>{error}</p>;
  }

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      {allPositions.length === 0 ? (
        <p>You have no open positions.</p>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg.</th>
                <th>LTP</th>
                <th>P&L</th>
                <th>Chg.</th>
              </tr>
            </thead>
            <tbody>
              {allPositions.map((stock, index) => {
                const currValue = stock.price * stock.qty;
                const stockPL = currValue - stock.avg * stock.qty;
                const isProfit = stockPL >= 0;
                const profitClass = isProfit ? "profit" : "loss";
                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr key={stock._id || index}>
                    <td>{stock.product}</td>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>{stock.avg.toFixed(2)}</td>
                    <td>{stock.price.toFixed(2)}</td>
                    <td className={profitClass}>{stockPL.toFixed(2)}</td>
                    <td className={dayClass}>{stock.day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Positions;