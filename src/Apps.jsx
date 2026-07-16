import React, { useState, useEffect } from "react";
import api from "./api";
import Modal from "./Modal";
import "./Apps.css";

const Apps = () => {
  const [activeTab, setActiveTab] = useState("gtt"); // "gtt" | "alerts"
  const [gtts, setGtts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get("/gtt/all"), api.get("/alert/all")])
      .then(([gttRes, alertRes]) => {
        setGtts(gttRes.data);
        setAlerts(alertRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelGtt = (id) => {
    api.delete(`/gtt/cancel/${id}`).then(() => fetchData());
  };

  const handleCancelAlert = (id) => {
    api.delete(`/alert/cancel/${id}`).then(() => fetchData());
  };

  const statusClass = (status) => `apps-status apps-status-${status.toLowerCase()}`;

  return (
    <div className="apps-page">
      <div className="apps-tabs">
        <button
          className={`apps-tab ${activeTab === "gtt" ? "active" : ""}`}
          onClick={() => setActiveTab("gtt")}
        >
          GTT Orders
        </button>
        <button
          className={`apps-tab ${activeTab === "alerts" ? "active" : ""}`}
          onClick={() => setActiveTab("alerts")}
        >
          Price Alerts (Sentinel)
        </button>
      </div>

      <button className="apps-create-btn" onClick={() => setShowCreateModal(true)}>
        + Create {activeTab === "gtt" ? "GTT Order" : "Alert"}
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === "gtt" ? (
        gtts.length === 0 ? (
          <div className="apps-empty">No GTT orders yet.</div>
        ) : (
          <table className="apps-table">
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Condition</th>
                <th>Trigger Price</th>
                <th>Qty</th>
                <th>Mode</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {gtts.map((gtt) => (
                <tr key={gtt._id}>
                  <td>{gtt.name}</td>
                  <td>{gtt.condition}</td>
                  <td>₹{gtt.triggerPrice.toFixed(2)}</td>
                  <td>{gtt.qty}</td>
                  <td>{gtt.mode}</td>
                  <td>
                    <span className={statusClass(gtt.status)}>{gtt.status}</span>
                  </td>
                  <td>
                    {gtt.status === "ACTIVE" && (
                      <button className="apps-cancel-btn" onClick={() => handleCancelGtt(gtt._id)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : alerts.length === 0 ? (
        <div className="apps-empty">No price alerts yet.</div>
      ) : (
        <table className="apps-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Condition</th>
              <th>Trigger Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert._id}>
                <td>{alert.name}</td>
                <td>{alert.condition}</td>
                <td>₹{alert.triggerPrice.toFixed(2)}</td>
                <td>
                  <span className={statusClass(alert.status)}>{alert.status}</span>
                </td>
                <td>
                  {alert.status === "ACTIVE" && (
                    <button className="apps-cancel-btn" onClick={() => handleCancelAlert(alert._id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreateModal && (
        <CreateModal
          type={activeTab}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

const CreateModal = ({ type, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("ABOVE");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [qty, setQty] = useState("");
  const [mode, setMode] = useState("BUY");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!name || !triggerPrice || (type === "gtt" && !qty)) {
      setError("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      if (type === "gtt") {
        await api.post("/gtt/create", {
          name: name.toUpperCase(),
          triggerPrice: Number(triggerPrice),
          condition,
          qty: Number(qty),
          mode,
        });
      } else {
        await api.post("/alert/create", {
          name: name.toUpperCase(),
          triggerPrice: Number(triggerPrice),
          condition,
        });
      }
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create");
      setSubmitting(false);
    }
  };

  return (
    <Modal title={type === "gtt" ? "Create GTT Order" : "Create Price Alert"} onClose={onClose}>
      <label>Instrument (e.g. INFY)</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="INFY" />

      <label>Condition</label>
      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        style={{
          width: "100%",
          height: "42px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "14px",
          padding: "0 12px",
        }}
      >
        <option value="ABOVE">Price goes ABOVE</option>
        <option value="BELOW">Price goes BELOW</option>
      </select>

      <label>Trigger Price (₹)</label>
      <input
        type="number"
        value={triggerPrice}
        onChange={(e) => setTriggerPrice(e.target.value)}
        placeholder="1600"
      />

      {type === "gtt" && (
        <>
          <label>Quantity</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="5" />

          <label>Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              width: "100%",
              height: "42px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "14px",
              padding: "0 12px",
            }}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </>
      )}

      {error && <p className="modal-error">{error}</p>}

      <button className="modal-submit" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Creating..." : "Create"}
      </button>
    </Modal>
  );
};

export default Apps;