// HouseManagerContext.jsx
import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import HouseManager from "../game/HouseManager";
import ExitModal from "../components/ExitModal";

const HouseManagerContext = createContext(null);

export const useHouseManager = () => useContext(HouseManagerContext);

export const HouseManagerProvider = ({ topic, onExit, children }) => {
  const [showExit, setShowExit] = useState(false);

  // Reset exit modal whenever topic changes
  useEffect(() => {
    setShowExit(false);
  }, [topic]);

  const managerRef = useRef();
  if (!managerRef.current) {
    managerRef.current = new HouseManager(topic);
  }

  useEffect(() => {
    // --- Reactively update when manager notifies ---
    const unsubscribeManager = managerRef.current.subscribe((newState) => {
      if (newState.exiting)
        handleExit();
    });
    // Cleanup both subscriptions
    return () => {
      unsubscribeManager();
    };
  }, [managerRef]);

  const handleExit = () => {
    setShowExit(true);
  }

  const handleCancel = () => {
    managerRef.current.cancelExit();
    setShowExit(false);
  }

  const handleConfirm = () => {
    setShowExit(false);
    onExit();
  };

  return (
    <HouseManagerContext.Provider value={managerRef}>
      {children}

      {/* Exit Confirmation */}
      <ExitModal
        visible={showExit}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </HouseManagerContext.Provider>
  );
};
