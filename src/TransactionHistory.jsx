import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/transactions")
      .then((res) => setTransactions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isCredit = (type) => type === "DEPOSIT" || type === "SELL";

  if (loading) {
    return <p>Loading transaction history...</p>;
  }

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h3 className="title">Transaction History</h3>
        <Link to="/funds" style={{ fontSize: "0.85rem", color: "#4184f3" }}>
          Back to Funds
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="transactions-empty">No transactions yet.</div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Balance After</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{new Date(txn.createdAt).toLocaleString()}</td>
                <td>
                  <span className={`txn-type txn-${txn.type.toLowerCase()}`}>{txn.type}</span>
                </td>
                <td>{txn.description}</td>
                <td className={isCredit(txn.type) ? "txn-amount-credit" : "txn-amount-debit"}>
                  {isCredit(txn.type) ? "+" : "-"}₹{txn.amount.toFixed(2)}
                </td>
                <td>₹{txn.balanceAfter.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;