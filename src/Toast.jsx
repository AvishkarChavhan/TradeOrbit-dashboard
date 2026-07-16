import React, { useState, useEffect } from "react";
import socket from "./socket";
import "./Toast.css";

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleGttTriggered = (data) => {
      const message = data.success
        ? `GTT executed: ${data.mode} ${data.name} at ₹${data.price}`
        : `GTT failed: ${data.mode} ${data.name} (insufficient funds/qty)`;
      pushToast(message, data.success ? "success" : "error");
    };

    const handleAlertTriggered = (data) => {
      pushToast(data.message, "info");
    };

    socket.on("gttTriggered", handleGttTriggered);
    socket.on("alertTriggered", handleAlertTriggered);

    return () => {
      socket.off("gttTriggered", handleGttTriggered);
      socket.off("alertTriggered", handleAlertTriggered);
    };
  }, []);

  const pushToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;