import React, { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handlemenuclick = (index) => {
    setSelectedMenu(index);
  };
  const handlprofileclick = (index) => {
    console.log("hii")
    setIsProfileOpen(!isProfileOpen);
  };
  const menuClass = "menu";
  const activeMenuClass = "menu selected";
  return (
    <div className="menu-container">
      <img
        src="public/logo (2).png"
        style={{ width: "50px", height: "auto" }}
      />
      <div className="menus">
        <ul>
          <li>
            <Link
              to="/"
              style={{ textDecoration: "none" }}
              onClick={() => handlemenuclick(0)}
            >
              <p
                className={selectedMenu === 0 ? activeMenuClass : menuClass}
              >
                Dashboard
              </p>
            </Link>
          </li>
          <li>
           <Link
              to="/orders"
              style={{ textDecoration: "none" }}
              onClick={() => handlemenuclick(1)}
            >
              <p
                className={selectedMenu === 1 ? activeMenuClass : selectedMenu}
              >
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/holdings"
              style={{ textDecoration: "none" }}
              onClick={() => handlemenuclick(2)}
            >
              <p
                className={selectedMenu === 2 ? activeMenuClass : selectedMenu}
              >
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/positions"
              style={{ textDecoration: "none" }}
              onClick={() => handlemenuclick(3)}
            >
              <p
                className={selectedMenu === 3 ? activeMenuClass : selectedMenu}
              >
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/funds"
              style={{ textDecoration: "none" }}
              onClick={() => handlemenuclick(4)}
            >
              <p
                className={selectedMenu === 4 ? activeMenuClass : selectedMenu}
              >
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/apps"
              style={{ textDecoration: "none" }}
              onClick={() => handlemenuclick(5)}
            >
              <p
                className={selectedMenu === 5 ? activeMenuClass : selectedMenu}
              >
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handlprofileclick}>
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
        </div>
        
      </div>
    </div>
  );
};

export default Menu;
