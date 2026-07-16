import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import Modal from "./Modal";
import "./Funds.css";

const Funds = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWallet = () => {
    api
      .get("/wallet")
      .then((res) => setBalance(res.data.balance))
      .catch(() => setError("Failed to load wallet"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const openModal = (type) => {
    setActiveModal(type);
    setAmount("");
    setError("");
  };

  const closeModal = () => {
    setActiveModal(null);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    const value = Number(amount);

    if (!value || value <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setSubmitting(true);
    const endpoint = activeModal === "add" ? "/wallet/add" : "/wallet/withdraw";

    try {
      const res = await api.post(endpoint, { amount: value });
      setBalance(res.data.balance);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading wallet...</p>;
  }

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>
        <button className="funds-btn funds-btn-green" onClick={() => openModal("add")}>
          Add funds
        </button>
        <button className="funds-btn funds-btn-blue" onClick={() => openModal("withdraw")}>
          Withdraw
        </button>
      </div>

      <div className="funds-row">
        <div className="funds-col">
          <span>
            <p>Equity</p>
          </span>

          <div className="funds-table">
            <div className="data">
              <p>Available balance</p>
              <p className="funds-imp funds-colored">₹{balance.toFixed(2)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>₹{balance.toFixed(2)}</p>
            </div>
          </div>

          <Link to="/transactions" style={{ fontSize: "0.85rem", color: "#4184f3", display: "inline-block", marginTop: "12px" }}>
            View Transaction History →
          </Link>
        </div>

        <div className="funds-col">
          <div className="funds-commodity">
            <p>You don't have a commodity account</p>
            <button className="funds-btn funds-btn-blue">Open Account</button>
          </div>
        </div>
      </div>

      {activeModal && (
        <Modal
          title={activeModal === "add" ? "Add Funds" : "Withdraw Funds"}
          onClose={closeModal}
        >
          <label htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          {error && <p className="modal-error">{error}</p>}
          <button className="modal-submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Processing..." : activeModal === "add" ? "Add Funds" : "Withdraw"}
          </button>
        </Modal>
      )}
    </>
  );
};

export default Funds;