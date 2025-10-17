// src/components/FloorPlan.jsx
import React from "react";

export default function FloorPlan({
  floorplan,
  borderClass = "",
  hoverEffect = "",
  debugClass = "",
  onClick = null,
}) {
  if (!floorplan) return <div className="w-12 aspect-square" />;

  const bgColor = floorplan.color || "transparent";
  const name = floorplan.name || "";
  const doors = floorplan.doors || {};
  const doorStyle = "absolute bg-gray-800";

  return (
    <div
      className={`w-12 aspect-square ${debugClass} relative shadow-sm rounded-sx flex
        items-center justify-center text-xs font-semibold
        text-shadow-black text-shadow-md ${borderClass} ${hoverEffect}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick || undefined}
    >
      {name}

      {/* Doors */}
      {doors.north && (
        <div
          className={doorStyle}
          style={{ top: "-4px", left: "25%", width: "50%", height: "4px" }}
        />
      )}
      {doors.south && (
        <div
          className={doorStyle}
          style={{ bottom: "-4px", left: "25%", width: "50%", height: "4px" }}
        />
      )}
      {doors.west && (
        <div
          className={doorStyle}
          style={{ top: "25%", left: "-4px", width: "4px", height: "50%" }}
        />
      )}
      {doors.east && (
        <div
          className={doorStyle}
          style={{ top: "25%", right: "-4px", width: "4px", height: "50%" }}
        />
      )}
    </div>
  );
}
