import React, { useState } from "react";
import OrderActionWindow from "./OrderActionWindow";

const GeneralContext = React.createContext({
  openOrderWindow: (uid, mode) => {},
  closeOrderWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isOrderWindowOpen, setIsOrderWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedMode, setSelectedMode] = useState("BUY");

  const handleOpenOrderWindow = (uid, mode) => {
    setIsOrderWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedMode(mode);
  };

  const handleCloseOrderWindow = () => {
    setIsOrderWindowOpen(false);
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openOrderWindow: handleOpenOrderWindow,
        closeOrderWindow: handleCloseOrderWindow,
      }}
    >
      {props.children}
      {isOrderWindowOpen && (
        <OrderActionWindow uid={selectedStockUID} mode={selectedMode} />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;