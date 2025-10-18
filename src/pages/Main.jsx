// Main.jsx
import React from "react";
import House from "../components/House";
import ChooseFloorPlan from "../components/ChooseFloorPlan";
import { HouseManagerProvider } from "../context/HouseManagerContext";
import FloorPlanPanel from "../components/FloorPlanPanel";

const Main = ({ topic, onExit }) => {
  return (
    <HouseManagerProvider topic={topic} onExit={onExit}>
      <main className="flex flex-row gap-4">
        {/* House area */}
        <div className="flex flex-col items-center justify-center bg-gray-900 p-2">
          <House />
        </div>

        {/* Draft & Question panels */}
        <div className="flex flex-row items-start justify-center p-2">
          <ChooseFloorPlan />
          <FloorPlanPanel />
        </div>
      </main>
    </HouseManagerProvider>
  );
};

export default Main;
