import React from "react";
import Dashboard from "./DashBoard";
import TopBar from "./TopBar";
import Toast from "./Toast";

const Home = () => {
  return (
    <>
      <Toast />
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;