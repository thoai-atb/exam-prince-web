// src/components/Room.jsx
import React from "react";
import FloorPlan from "./FloorPlan";

export default function Room({
  room: { row, col, opened, openable, walkable, current, floorplan } = {},
  onClick = () => {},
}) {
  const isEnterable = openable || walkable;

  let borderClass = "";
  if (current) borderClass = "border-4 border-blue-400";
  else if (opened) borderClass = "border-4 border-gray-300";
  else if (isEnterable) borderClass = "border-gray-300 hover:border-4";

  const hoverEffect = isEnterable ? "hover:brightness-110 cursor-pointer" : "";

  const debugClass = `loc-${row}-${col}`;

  const widthClass = "w-16 aspect-square";

  // If not opened and not enterable, render empty space
  if (!opened && !isEnterable) return <div className={`${widthClass} ${debugClass}`} />;
  if (!opened && isEnterable) return <div className={`${widthClass} ${debugClass} ${borderClass} ${hoverEffect}`} onClick={() => onClick()} />;

  return (
    <FloorPlan
      floorplan={floorplan}
      widthClass={widthClass}
      borderClass={borderClass}
      hoverEffect={hoverEffect}
      debugClass={debugClass}
      onClick={isEnterable ? onClick : undefined}
    />
  );
}
