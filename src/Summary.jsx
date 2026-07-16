import React, { useState, useEffect } from "react";
import api from "./api";

const Summary = () => {
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "User");

    api.get("/allHoldings").then((res) => setHoldings(res.data)).catch(() => {});
    api.get("/allPositions").then((res) => setPositions(res.data)).catch(() => {});
    api.get("/wallet").then((res) => setBalance(res.data.balance)).catch(() => {});
  }, []);

  const totalInvestment = holdings.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const currentValue = holdings.reduce((sum, s) => sum + s.price * s.qty, 0);
  const holdingsPL = currentValue - totalInvestment;
  const holdingsPLPercent = totalInvestment > 0 ? (holdingsPL / totalInvestment) * 100 : 0;

  const marginUsed = positions.reduce((sum, s) => sum + s.price * s.qty, 0);

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{balance.toFixed(2)}</h3>
            <p>Available balance</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{marginUsed.toFixed(2)}</span>
            </p>
            <p>
              Total investment <span>₹{totalInvestment.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={holdingsPL >= 0 ? "profit" : "loss"}>
              ₹{holdingsPL.toFixed(2)}{" "}
              <small>
                ({holdingsPLPercent >= 0 ? "+" : ""}
                {holdingsPLPercent.toFixed(2)}%)
              </small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{currentValue.toFixed(2)}</span>
            </p>
            <p>
              Investment <span>₹{totalInvestment.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;