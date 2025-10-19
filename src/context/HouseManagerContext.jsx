// HouseManagerContext.jsx
import React, { createContext, useContext, useRef, useEffect } from "react";
import HouseManager from "../game/HouseManager";

const HouseManagerContext = createContext(null);

export const useHouseManager = () => useContext(HouseManagerContext);

export const HouseManagerProvider = ({ topic, onExit, children }) => {
  const managerRef = useRef();
  if (!managerRef.current) {
    managerRef.current = new HouseManager(topic);
  }

  useEffect(() => {
    // --- Reactively update when manager notifies ---
    const unsubscribeManager = managerRef.current.subscribe((newState) => {
      if (newState.exited)
        onExit();
    });
    // Cleanup both subscriptions
    return () => {
      unsubscribeManager();
    };
  }, [managerRef]);

  return (
    <HouseManagerContext.Provider value={managerRef}>
      {children}
    </HouseManagerContext.Provider>
  );
};
