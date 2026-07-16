import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import api from "./api";
import "./PnLReport.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  "rgba(255, 99, 132, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(255, 206, 86, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",
  "rgba(199, 199, 199, 0.7)",
];

const PnLReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/pnl")
      .then((res) => setReport(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading P&L report...</p>;
  }

  if (!report) {
    return <p>Failed to load report.</p>;
  }

  const {
    realizedPL,
    unrealizedPL,
    totalPL,
    totalInvestment,
    currentValue,
    holdingsBreakdown,
  } = report;

  const pieData = {
    labels: holdingsBreakdown.map((h) => h.name),
    datasets: [
      {
        data: holdingsBreakdown.map((h) => h.currentValueForStock),
        backgroundColor: holdingsBreakdown.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 1,
      },
    ],
  };

  const plClass = (value) => (value >= 0 ? "profit" : "loss");

  return (
    <div className="pnl-page">
      <h3 className="title">P&L Report (Console)</h3>

      <div className="pnl-summary-row">
        <div className="pnl-summary-card">
          <p className="label">Realized P&L</p>
          <h3 className={plClass(realizedPL)}>₹{realizedPL.toFixed(2)}</h3>
        </div>
        <div className="pnl-summary-card">
          <p className="label">Unrealized P&L</p>
          <h3 className={plClass(unrealizedPL)}>₹{unrealizedPL.toFixed(2)}</h3>
        </div>
        <div className="pnl-summary-card">
          <p className="label">Total P&L</p>
          <h3 className={plClass(totalPL)}>₹{totalPL.toFixed(2)}</h3>
        </div>
        <div className="pnl-summary-card">
          <p className="label">Current Portfolio Value</p>
          <h3>₹{currentValue.toFixed(2)}</h3>
        </div>
      </div>

      {holdingsBreakdown.length === 0 ? (
        <p>No current holdings to break down. Buy some stocks to see your portfolio allocation here.</p>
      ) : (
        <div className="pnl-chart-row">
          <div className="pnl-chart-box">
            <Pie data={pieData} />
          </div>

          <div className="pnl-table-box">
            <table className="pnl-table">
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty</th>
                  <th>Avg Cost</th>
                  <th>LTP</th>
                  <th>Invested</th>
                  <th>Current Value</th>
                  <th>P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdingsBreakdown.map((h) => (
                  <tr key={h.name}>
                    <td>{h.name}</td>
                    <td>{h.qty}</td>
                    <td>{h.avg.toFixed(2)}</td>
                    <td>{h.currentPrice.toFixed(2)}</td>
                    <td>{h.invested.toFixed(2)}</td>
                    <td>{h.currentValueForStock.toFixed(2)}</td>
                    <td className={plClass(h.pl)}>
                      {h.pl.toFixed(2)} ({h.plPercent >= 0 ? "+" : ""}
                      {h.plPercent.toFixed(2)}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PnLReport;