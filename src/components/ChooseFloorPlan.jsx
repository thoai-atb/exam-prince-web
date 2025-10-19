import React, { useState, useEffect } from "react";
import FloorPlan from "./FloorPlan";
import KeyboardButton from "./KeyBoardButton";
import { useHouseManager } from "../pages/HouseContainer";
import { subscribeKeyboard } from "../input/controls";
import ItemDictionary from "../game/ItemDictionary";

export default function ChooseFloorPlan() {
  const [floorplans, setFloorplans] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
      const session = houseManagerRef.current.roomOpenSession;
      if (session.selectedFloorPlan) return;
      if (!session.active) return;

      switch (key) {
        case "w":
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : prev
          );
          break;
        case "s":
          setSelectedIndex((prev) =>
            prev < floorplans.length - 1 ? prev + 1 : prev
          );
          break;
        case "e":
          if (selectedIndex >= 0) {
            const selected = floorplans[selectedIndex];
            const pencilCount = houseManagerRef.current.items?.pencil || 0;
            if (selected.cost === 0 || pencilCount >= selected.cost) {
              houseManagerRef.current.selectFloorPlan(selected.name);
            } else {
              // maybe show feedback later like “not enough pencils”
              console.log("❌ Not enough pencils to select this floorplan");
            }
          }
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
      className="bg-gray-800 text-white shadow-md overflow-hidden ease-out"
      style={{
        transition: "all 0.3s ease-out",
        width: isVisible ? "28rem" : "0.5rem",
        padding: isVisible ? "1rem" : "0.25rem",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {isVisible && (
        <>
          <h2 className="text-lg font-bold mb-2 text-center">
            Choose a floor plan
          </h2>

          <div className="flex flex-col gap-3">
            {floorplans.map((fp, index) => {
              const pencilCount = houseManagerRef.current.items?.pencil || 0;
              const canSelect = fp.cost === 0 || pencilCount >= fp.cost;

              return (
                <div
                  key={fp.name}
                  className={`flex items-center gap-2 rounded-md p-2 cursor-pointer transition-all
                    ${index === selectedIndex ? "bg-gray-700" : "hover:bg-gray-700"}
                    ${!canSelect ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  onClick={() => {
                    if (canSelect) houseManagerRef.current.selectFloorPlan(fp.name);
                  }}
                >
                  <FloorPlan
                    floorplan={fp}
                    borderClass={
                      index === selectedIndex
                        ? "border-4 border-blue-300"
                        : "border-4 border-white"
                    }
                    hoverEffect={canSelect ? "hover:brightness-110" : ""}
                  />

                  <div className="text-sm font-semibold text-left pl-4 flex-1 flex items-center justify-between">
                    <span>{fp.name}</span>

                    <div className="flex">
                      {fp.items?.length > 0 && (
                        <div className="flex gap-1 ml-2 font-bold text-green-500">+</div>
                      )}
                      {fp.items?.length > 0 && (
                        <div className="flex gap-1">
                          {fp.items.map((item, i) => (
                            <span key={i} title={ItemDictionary.get(item).name}>
                              {ItemDictionary.get(item).icon}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {fp.cost === 0 && (
                    <div className="text-gray-300 font-thin w-20">free</div>
                  )}
                  {fp.cost > 0 && (
                    <div
                      className={`font-thin w-20 text-yellow-500`}
                    >
                      cost <span className="font-bold">{fp.cost}</span> {ItemDictionary.get("pencil").icon}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            <KeyboardButton>W</KeyboardButton> <KeyboardButton>S</KeyboardButton> to move,{" "}
            <KeyboardButton>E</KeyboardButton> to select
          </p>
        </>
      )}
    </div>
  );
}
