import React, { useState, useEffect, useRef } from "react";
import Question from "./Question";
import FloorPlanInfo from "./FloorPlanInfo";
import { useHouseManager } from "../pages/HouseContainer";
import ExamEntrance from "./ExamEntrance";
import ExamSubmission from "./ExamSubmission";
import ExamLibrary from "./ExamLibrary";
import KeyboardButton from "./KeyboardButton";

export default function QuestionPanel() {
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

  const width = "40rem";

  if (!selectedFloorPlan) return <div style={{ width }} className="opacity-0" />;

  return (
    <div
      style={{ width }}
      className="relative flex flex-col items-center justify-center bg-gray-800 text-white min-w-30 shadow-md p-6 rounded-md space-y-3"
    >
      <FloorPlanInfo floorPlan={selectedFloorPlan} />

      <Question
        question={selectedFloorPlan.question}
        userAnswer={userAnswer}
        handleAnswerClick={handleAnswerClick}
        handleProceed={handleProceed}
        isDrafting={houseManagerRef.current.isDrafting()}
        erasable={houseManagerRef.current.erasable()}
        handleErase={() => houseManagerRef.current.eraseAnswer()}
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
      {selectedFloorPlan.special === "library" && (
        <ExamLibrary
        />
      )}

      {!houseManagerRef.current.isDrafting() && (
        <p className="flex flex-wrap items-center text-gray-400 gap-1 text-xs">
          Move with
          <KeyboardButton>W</KeyboardButton>
          <KeyboardButton>A</KeyboardButton>
          <KeyboardButton>S</KeyboardButton>
          <KeyboardButton>D</KeyboardButton>
          <span className="ml-1">or 🖱️ mouse click on rooms.</span>
        </p>
      )}

      {cheat && (
        <div className="text-green-400 text-xs">
          👁️ Secret mode activated
        </div>
      )}
    </div>
  );
}
