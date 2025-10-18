// src/components/FloorPlan.jsx
import React from "react";

export default function FloorPlan({
  floorplan,
  widthClass = "w-16",
  borderClass = "",
  hoverEffect = "",
  debugClass = "",
  fontSize = "0.50rem",
  overrideBgColor = null,
  textClass = "",
  onClick = null,
}) {
  if (!floorplan) return <div className={`${widthClass} aspect-square`} />;

  const bgColor = overrideBgColor || floorplan.color || "transparent";
  const name = floorplan.name || "";
  const doors = floorplan.doors || {};
  const doorStyle = "absolute bg-gray-800";
  const textShadowCss = "0.0625rem 0.0625rem 0.125rem black";

  return (
    <div
      className={`${widthClass} ${debugClass} aspect-square relative shadow-sm rounded-sx flex
        items-center justify-center font-semibold
        text-shadow-black ${borderClass} ${hoverEffect}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick || undefined}
    >
      <p
        style={{
          fontSize: fontSize,
          zIndex: 10,
          textShadow: `${textShadowCss}`,
        }}
        className={textClass}
      >
        {name}
      </p>

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
