import React, { createContext, useState } from "react";

// Create the context
export const GeneralContext = createContext();

// Create the provider component
export const GeneralContextProvider = ({ children }) => {
  const [exampleState, setExampleState] = useState("initial");

  return (
    <GeneralContext.Provider value={{ exampleState, setExampleState }}>
      {children}
    </GeneralContext.Provider>
  );
};
