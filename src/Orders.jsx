import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/allOrders")
      .then((res) => {
        const filtered = res.data.filter((order) => order && order.name);
        setOrders(filtered);
      })
      .catch(() => {
        setError("Failed to load orders. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    api
      .delete(`/deleteOrder/${id}`)
      .then(() => {
        setOrders((prev) => prev.filter((order) => order._id !== id));
      })
      .catch(() => {
        alert("Failed to delete order. Please try again.");
      });
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p style={{ color: "#d9363e" }}>{error}</p>;
  }

  return (
    <div className="orders">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <p>
                <strong>{order.name}</strong>
              </p>
              <p>Quantity: {order.qty}</p>
              <p>Price: ₹{order.price}</p>
              <p>Mode: {order.mode}</p>
              <button onClick={() => handleDelete(order._id)}>Delete Order</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;