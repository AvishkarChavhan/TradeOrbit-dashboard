import React, { useState, useEffect } from "react";
import api from "./api";
import VerticalGraph from "./verticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/allHoldings")
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch(() => {
        setError("Failed to load holdings. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0
  );
  const totalPL = currentValue - totalInvestment;
  const totalPLPercent =
    totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;

  const labels = allHoldings.map((stock) => stock.name);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(236, 96, 126, 0.5)",
      },
    ],
  };

  if (loading) {
    return <p>Loading holdings...</p>;
  }

  if (error) {
    return <p style={{ color: "#d9363e" }}>{error}</p>;
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {allHoldings.length === 0 ? (
        <p>You have no holdings yet.</p>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg. cost</th>
                <th>LTP</th>
                <th>Cur. val</th>
                <th>P&L</th>
                <th>Net chg.</th>
                <th>Day chg.</th>
              </tr>
            </thead>
            <tbody>
              {allHoldings.map((stock, index) => {
                const currValue = stock.price * stock.qty;
                const stockPL = currValue - stock.avg * stock.qty;
                const isProfit = stockPL >= 0;
                const profitClass = isProfit ? "profit" : "loss";
                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr key={stock._id || index}>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>{stock.avg.toFixed(2)}</td>
                    <td>{stock.price.toFixed(2)}</td>
                    <td>{currValue.toFixed(2)}</td>
                    <td className={profitClass}>{stockPL.toFixed(2)}</td>
                    <td className={profitClass}>{stock.net}</td>
                    <td className={dayClass}>{stock.day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="row">
        <div className="col">
          <h5>₹{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>
            ₹{totalPL.toFixed(2)} ({totalPLPercent >= 0 ? "+" : ""}
            {totalPLPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      {allHoldings.length > 0 && <VerticalGraph data={chartData} />}
    </>
  );
};

export default Holdings;