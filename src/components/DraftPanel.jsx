import React, { useState, useEffect } from "react";
import FloorPlan from "./FloorPlan";

export default function DraftPanel({ houseManagerRef }) {
  const [floorplans, setFloorplans] = useState([]);

  useEffect(() => {
    const update = () => {
      const req = houseManagerRef.current.openRoomRequest;
      if (req?.floorplans?.length) {
        setFloorplans([...req.floorplans]);
      } else {
        setFloorplans([]);
      }
    };

    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [houseManagerRef]);

  const handleSelect = (fpName) => {
    houseManagerRef.current.endOpenRoom(fpName);
  };

  const isVisible = floorplans.length > 0;

  return (
    <div
      className={`
        bg-gray-800 text-white shadow-md overflow-hidden
        transition-all duration-300 ease-in-out
        ${isVisible ? "w-64 p-4 opacity-100" : "w-0 p-0 opacity-0"}
      `}
    >
      {isVisible && (
        <>
          <h2 className="text-lg font-bold mb-2">Choose a floor plan</h2>

          <div className="flex flex-col gap-3">
            {floorplans.map((fp) => (
              <div
                key={fp.name}
                className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-gray-700 transition-all"
                onClick={() => handleSelect(fp.name)}
              >
                <FloorPlan
                  floorplan={fp}
                  borderClass="border-4 border-white"
                  hoverEffect="hover:brightness-110"
                />
                <div className="text-sm font-semibold">{fp.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
