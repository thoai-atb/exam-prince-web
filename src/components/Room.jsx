// src/components/Room.jsx
import React from "react";
import FloorPlan from "./FloorPlan";

export default function Room({
  room: { row, col, opened, openable, walkable, current, floorplan, beingDrafted, failed } = {},
  isDrafting = false,
  onClick = () => {},
}) {
  const isEnterable = openable || walkable;

  let borderClass = "";
  if (current) borderClass = "border-4 border-blue-400";
  else if (failed) borderClass = "border-4 border-red-400";
  else if (opened) borderClass = "border-4 border-gray-300";
  else if (beingDrafted) borderClass = "border-4 border-yellow-400";
  else if (!isDrafting && isEnterable) borderClass = "border-gray-300 hover:border-4";

  const hoverEffect = (!isDrafting && isEnterable) ? "hover:brightness-110 cursor-pointer" : "";

  const debugClass = `loc-${row}-${col}`;

  const widthClass = "w-16";

  // If not opened and not enterable, render empty space
  if (!opened && !isEnterable) return <div className={`${widthClass} aspect-square ${debugClass}`} />;
  if (!opened && isEnterable) return <div className={`${widthClass} aspect-square ${debugClass} ${borderClass} ${hoverEffect}`} onClick={() => onClick()} />;

  return (
    <FloorPlan
      floorplan={floorplan}
      widthClass={widthClass}
      borderClass={borderClass}
      hoverEffect={hoverEffect}
      debugClass={debugClass}
      overrideBgColor={failed ? "bg-black" : null}
      textClass={failed ? "text-red-400" : ""}
      onClick={isEnterable ? onClick : undefined}
    />
  );
}
