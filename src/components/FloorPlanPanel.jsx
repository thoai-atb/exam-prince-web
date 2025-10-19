import React, { useState, useEffect, useRef } from "react";
import Question from "./Question";
import FloorPlanInfo from "./FloorPlanInfo";
import { useHouseManager } from "../pages/HouseContainer";
import ExamEntrance from "./ExamEntrance";
import ExamSubmission from "./ExamSubmission";

export default function FloorPlanPanel() {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [cheat, setCheat] = useState(false);

  const typedRef = useRef(""); // buffer stored in ref (no re-renders)
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
    };

    const unsubscribe = manager.subscribe(() => {
      refresh();
    });

    refresh();

    return () => unsubscribe();
  }, [houseManagerRef]);

  // ✅ Secret word detection (now "look")
  useEffect(() => {
    const SECRET_WORD = "look"; // change this word anytime

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        typedRef.current = (typedRef.current + key).slice(-SECRET_WORD.length);

        if (typedRef.current === SECRET_WORD) {
          setCheat((prev) => {
            const next = !prev;
            console.log(`${SECRET_WORD} → cheat mode`, next ? "ON" : "OFF");
            return next;
          });

          // reset buffer after activation
          typedRef.current = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAnswerClick = (idx) => {
    houseManagerRef.current.setUserAnswer(idx);
  };

  const handleProceed = () => {
    houseManagerRef.current.useFloorPlan();
  };

  if (!selectedFloorPlan) return <div style={{ width: "32rem" }} className="opacity-0" />;

  return (
    <div
      style={{ width: "32rem" }}
      className="flex flex-col items-center justify-center bg-gray-800 text-white min-w-30 shadow-md p-6 rounded-md space-y-4"
    >
      <FloorPlanInfo floorPlan={selectedFloorPlan} />

      <Question
        question={selectedFloorPlan.question}
        userAnswer={userAnswer}
        handleAnswerClick={handleAnswerClick}
        handleProceed={handleProceed}
        isDrafting={houseManagerRef.current.isDrafting()}
        cheat={cheat}
      />

      {selectedFloorPlan.special === "entrance" && (
        <ExamEntrance onExit={() => houseManagerRef.current.exitHouse()} />
      )}
      {selectedFloorPlan.special === "submission" && (
        <ExamSubmission
          submitable={houseManagerRef.current.items["sheet"] > 0}
          onSubmit={() => houseManagerRef.current.submit()}
        />
      )}

      {cheat && (
        <div className="text-green-400 text-xs mt-2">
          👁️ Secret mode activated
        </div>
      )}
    </div>
  );
}
