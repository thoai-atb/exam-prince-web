// FloorPlanInfo.jsx
import React from "react";
import InfoField from "./InfoField";
import FloorPlan from "./FloorPlan";

export default function FloorPlanInfo({ floorPlan }) {
  if (!floorPlan) return null;

  return (
    <div className="flex flex-row items-start gap-6 h-32">
      <FloorPlan
        floorplan={floorPlan}
        borderClass="border-4 border-white"
        widthClass="w-32"
        hoverEffect=""
        fontSize="1.2rem"
      />

      <div className="flex flex-col justify-center gap-2 text-sm text-left w-64">
        <InfoField label="Floor plan ID" value={floorPlan.id} />
        <InfoField label="Room" value={floorPlan.name} />
        <InfoField
          label="Doors"
          value={
            Object.entries(floorPlan.doors)
              .filter(([_, exists]) => exists)
              .map(([dir]) => dir.toUpperCase())
              .join(", ") || "None"
          }
        />
        {floorPlan.question && (
          <InfoField label="Difficulty" value={floorPlan.question.difficulty} />
        )}
        {floorPlan.special && (
          <InfoField label="Special" value={"EXAM ENTRANCE"} />
        )}
      </div>
    </div>
  );
}
