// Main.jsx
import React, { useEffect, useState } from "react";
import House from "../components/House";
import ChooseFloorPlan from "../components/ChooseFloorPlan";
import { HouseManagerProvider } from "../context/HouseManagerContext";
import FloorPlanPanel from "../components/FloorPlanPanel";
import ItemPanel from "../components/ItemPanel";

const Main = ({ topic, onExit }) => {
  return (
    <HouseManagerProvider topic={topic} onExit={onExit}>
      <main className="flex flex-row gap-4">
        <div className="flex">
          <ItemPanel />
        </div>
        {/* House area */}
        <div className="flex flex-col items-center justify-center bg-gray-900 p-2">
          <House />
        </div>

        {/* Draft & Question panels */}
        <div className="relative flex flex-row items-start justify-center p-2">
          <div className="absolute top-0 left-0">
            <ChooseFloorPlan />
          </div>
          <FloorPlanPanel />
        </div>
      </main>
    </HouseManagerProvider>
  );
};

export default Main;
