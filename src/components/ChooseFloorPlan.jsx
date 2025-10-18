import React, { useState, useEffect } from "react";
import FloorPlan from "./FloorPlan";
import KeyboardButton from "./KeyBoardButton";
import { useHouseManager } from "../context/HouseManagerContext";
import { subscribeKeyboard } from "../input/controls";

export default function ChooseFloorPlan() {
  const [floorplans, setFloorplans] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const houseManagerRef = useHouseManager();

  useEffect(() => {
    const update = () => {
      const req = houseManagerRef.current.roomOpenSession;
      if (req?.floorPlans?.length) {
        setFloorplans([...req.floorPlans]);
      } else {
        setFloorplans([]);
      }
    };

    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [houseManagerRef]);

  useEffect(() => {
    const unsubscribeKeyboard = subscribeKeyboard((key) => {
      if (floorplans.length === 0) return;
      if (houseManagerRef.current.roomOpenSession.selectedFloorPlan) return;
      if (!houseManagerRef.current.roomOpenSession.active) return;

      switch (key) {
        case "w": // move up
          setSelectedIndex((prev) => (prev - 1 + floorplans.length) % floorplans.length);
          break;
        case "s": // move down
          setSelectedIndex((prev) => (prev + 1) % floorplans.length);
          break;
        case "e": // select
          if (selectedIndex >= 0)
            houseManagerRef.current.selectFloorPlan(floorplans[selectedIndex].name);
          break;
        default:
          break;
      }
    });

    return () => unsubscribeKeyboard();
  }, [floorplans, selectedIndex, houseManagerRef]);

  const isVisible =
    floorplans.length > 0 &&
    !houseManagerRef.current.roomOpenSession.selectedFloorPlan;

  return (
    <div
      className={`
        bg-gray-800 text-white shadow-md overflow-hidden duration-300 ease-out
        ${isVisible ? "w-96 p-4 opacity-100" : "w-2 h-full p-2 opacity-0"}
      `}
    >
      {isVisible && (
        <>
          <h2 className="text-lg font-bold mb-2 text-center">
            Choose a floor plan
          </h2>

          <div className="flex flex-col gap-3">
            {floorplans.map((fp, index) => (
              <div
                key={fp.name}
                className={`flex items-center gap-2 cursor-pointer rounded-md p-2 
                  ${index === selectedIndex ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => houseManagerRef.current.selectFloorPlan(fp.name)}
              >
                <FloorPlan
                  floorplan={fp}
                  borderClass={
                    index === selectedIndex
                      ? "border-4 border-blue-300"
                      : "border-4 border-white"
                  }
                  hoverEffect="hover:brightness-110"
                />
                <div className="text-sm font-semibold text-left pl-4 flex-1">
                  {fp.name}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            <KeyboardButton>W</KeyboardButton> <KeyboardButton>S</KeyboardButton> to move, <KeyboardButton>E</KeyboardButton> to select
          </p>
        </>
      )}
    </div>
  );
}
