import React, { useState, useEffect } from "react";
import InfoField from "./InfoField";
import FloorPlan from "./FloorPlan";

export default function RoomPanel({ houseManagerRef }) {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);

  useEffect(() => {
    const manager = houseManagerRef.current;
    if (!manager) return;

    // Subscribe to manager changes
    const unsubscribe = manager.subscribe(() => {
      const session = manager.roomOpenSession;
      setSelectedFloorPlan(session?.selectedFloorPlan || null);
      setUserAnswer(session?.userAnswer ?? null);
    });

    // Initialize immediately
    const session = manager.roomOpenSession;
    setSelectedFloorPlan(session?.selectedFloorPlan || null);
    setUserAnswer(session?.userAnswer ?? null);

    return () => unsubscribe();
  }, [houseManagerRef]);

  if (!selectedFloorPlan) return null;

  const question = selectedFloorPlan.question;

  const handleAnswerClick = (idx) => {
    houseManagerRef.current.setUserAnswer(idx);
  };

  const handleProceed = () => {
    houseManagerRef.current.useFloorPlan();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white min-w-30 shadow-md p-6 rounded-md space-y-4">
      {/* FloorPlan + Info Panel */}
      <div className="flex flex-row items-start gap-6 h-32">
        <FloorPlan
          floorplan={selectedFloorPlan}
          borderClass="border-4 border-white"
          widthClass="w-32"
          hoverEffect=""
          fontSize="1.2rem"
        />

        <div className="flex flex-col justify-center gap-2 text-sm text-left">
          <InfoField label="Floor plan ID" value={selectedFloorPlan.id} />
          <InfoField label="Room" value={selectedFloorPlan.name} />
          <InfoField
            label="Doors"
            value={
              Object.entries(selectedFloorPlan.doors)
                .filter(([_, exists]) => exists)
                .map(([dir]) => dir.toUpperCase())
                .join(", ") || "None"
            }
          />
          {selectedFloorPlan.question && (
            <InfoField label="Difficulty" value={selectedFloorPlan.question.difficulty} />
          )}
        </div>
      </div>

      {/* Question */}
      {question && (
        <div className="mt-4 w-full max-w-md bg-gray-900 p-4 rounded-md space-y-3 ease-out transition-all duration-500">
          <h3 className="text-md font-semibold">{question.concept}</h3>
          <p className="text-sm">{question.question}</p>

          {/* Answers */}
          <div className="flex flex-col gap-2 mt-2 text-xs">
            {question.answers.map((answer, idx) => {
              let bgClass = "bg-gray-700 hover:bg-gray-600";

              if (userAnswer !== null && idx === userAnswer) {
                bgClass = question.isCorrect(userAnswer)
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white";
              }

              let cursorClass = userAnswer === null ? "cursor-pointer" : "";

              return (
                <div
                  key={idx}
                  className={`p-2 ${cursorClass} rounded-sm text-left w-full transition-colors ${bgClass}`}
                  onClick={() => handleAnswerClick(idx)}
                >
                  {answer}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {userAnswer !== null && question.explanation && (
            <div className="mt-2 text-sm italic text-gray-300">{question.explanation}</div>
          )}

          {/* Proceed Button */}
          <div
            className={`mt-4 w-full flex justify-center transition-opacity duration-700 ${
              userAnswer !== null ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-all"
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
