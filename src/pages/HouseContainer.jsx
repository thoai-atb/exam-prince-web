import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import House from "../components/House";
import ChooseFloorPlan from "../components/ChooseFloorPlan";
import FloorPlanPanel from "../components/FloorPlanPanel";
import ItemPanel from "../components/ItemPanel";
import ExitModal from "../components/ExitModal";
import HouseManager from "../game/HouseManager";
import ExamResult from "./ExamResult";

// -------------------- Context Setup --------------------
const HouseManagerContext = createContext(null);
export const useHouseManager = () => useContext(HouseManagerContext);

// -------------------- Main House Component --------------------
export default function HouseContainer({ topic, onExit }) {
  const [showExit, setShowExit] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const managerRef = useRef();

  // Create manager only once
  if (!managerRef.current) {
    managerRef.current = new HouseManager(topic);
  }

  // Reset modal when topic changes
  useEffect(() => {
    setShowExit(false);
  }, [topic]);

  // Subscribe to manager events
  useEffect(() => {
    const unsubscribe = managerRef.current.subscribe((newState) => {
      if (newState.exiting) handleExit();
      if (newState.submitted) setShowResult(true);
    });
    return () => unsubscribe();
  }, []);

  // Exit modal handlers
  const handleExit = () => setShowExit(true);
  const handleCancel = () => {
    managerRef.current.cancelExit();
    setShowExit(false);
  };
  const exit = () => {
    setShowExit(false);
    setShowResult(false);
    onExit();
  };

  return (
    <HouseManagerContext.Provider value={managerRef}>
      {/* Main Game */}
      {!showResult && (
        <main className="flex flex-row gap-4">
          {/* Left Panel – Items */}
          <div className="flex">
            <ItemPanel />
          </div>

          {/* Middle – House */}
          <div className="flex flex-col items-center justify-center bg-gray-900 p-2">
            <House />
          </div>

          {/* Right Panel – Floor Plans */}
          <div className="relative flex flex-row items-start justify-center p-2">
            <div className="absolute top-0 left-0">
              <ChooseFloorPlan />
            </div>
            <FloorPlanPanel />
          </div>
        </main>
      )}

      {/* Exit Modal */}
      <ExitModal
        visible={showExit}
        onConfirm={exit}
        onCancel={handleCancel}
      />

      {/* Result */}
      {showResult && (
        <ExamResult onExit={exit} />
      )}
    </HouseManagerContext.Provider>
  );
}
