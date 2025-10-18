import React, { useState, useEffect } from "react";
import Question from "./Question";
import FloorPlanInfo from "./FloorPlanInfo";
import { useHouseManager } from "../context/HouseManagerContext";
import ExamEntrance from "./ExamEntrance";


export default function FloorPlanPanel() {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);

  const houseManagerRef = useHouseManager();

  useEffect(() => {
    const manager = houseManagerRef.current;
    if (!manager) return;

    const refresh = () => {
      const session = manager.roomOpenSession;
      if (manager.isDrafting()) {
        setSelectedFloorPlan(session?.selectedFloorPlan || null);
        setUserAnswer(session?.userAnswer ?? null);
      } else {
        const fp = manager.getCurrentFloorPlan();
        setSelectedFloorPlan(fp);
        setUserAnswer(fp.question?.correctIdx);
      }
    }

    // Subscribe to manager changes
    const unsubscribe = manager.subscribe(() => {
      refresh();
    });

    refresh();

    return () => unsubscribe();
  }, [houseManagerRef]);

  if (!selectedFloorPlan) return null;

  const handleAnswerClick = (idx) => {
    houseManagerRef.current.setUserAnswer(idx);
  };

  const handleProceed = () => {
    houseManagerRef.current.useFloorPlan();
  };

  return (
    <div style={{ width: "30rem" }} className="flex flex-col items-center justify-center bg-gray-800 text-white min-w-30 shadow-md p-6 rounded-md space-y-4">
      <FloorPlanInfo floorPlan={selectedFloorPlan} />

      <Question
        question={selectedFloorPlan.question}
        userAnswer={userAnswer}
        handleAnswerClick={handleAnswerClick}
        handleProceed={handleProceed}
        isDrafting={houseManagerRef.current.isDrafting()}
        cheat={false}
      />

      {selectedFloorPlan.special && (<ExamEntrance onExit={() => houseManagerRef.current.exitHouse()} />)}
    </div>
  );
}
