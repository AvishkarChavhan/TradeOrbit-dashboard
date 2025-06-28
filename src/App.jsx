import React from "react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./DashBoard";

import { GeneralContextProvider } from "./context/GeneralContext";

function App() {
  return (
    <BrowserRouter>
      <GeneralContextProvider>
        <Dashboard />
      </GeneralContextProvider>
    </BrowserRouter>
  );
}

export default App;
