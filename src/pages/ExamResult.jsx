import React, { useEffect, useState } from "react";
import { useHouseManager } from "./HouseContainer";
import House from "../components/House";
import Button from "../components/Button";

export default function ExamResult({ onExit }) {
  const house = useHouseManager().current;
  const topic = house.topic.topic;
  const roomsDiscovered = house.roomsDiscovered;
  const correct = house.roomsDiscovered - house.roomsFailed;
  const wrong = house.roomsFailed;
  const score = Math.floor((correct * 100) / roomsDiscovered);

  let grade;
  if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";
  else grade = "F";

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in a short moment after render
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => onExit();

  return (
    <div className="flex flex-row gap-4 max-h-4/5">
      <div className="relative flex flex-col gap-8 p-4 w-96 font-serif border-black border-8 items-center justify-center bg-gray-300 text-black overflow-hidden">
        <img
          src="/logo.png"
          alt="Exam Prince Stamp"
          className="absolute opacity-20 w-20 h-20 rotate-[-15deg] bottom-28 right-8 pointer-events-none select-none z-100"
        />

        <div className="text-3xl font-light italic z-10">🎓 Exam Certificate 🎓</div>
        <div className="text-xl z-10">
          You have <i>passed</i> the exam!
        </div>

        <div className="bg-white p-6 rounded-md shadow-lg w-80 text-center space-y-3 z-10">
          <div className="text-lg font-semibold uppercase">{topic}</div>
          <div>
            <span className="font-bold text-xl mr-1">{roomsDiscovered}</span> rooms discovered
          </div>
          <div>
            <span className="font-bold text-xl mr-1">{correct}</span> correct answer(s)
          </div>
          <div>
            <span className="font-bold text-xl mr-1">{wrong}</span> incorrect answer(s)
          </div>
          <div className="text-2xl font-thin mt-4 justify-center">
            <span className="mr-1 font-bold">{score}</span>
            <span className="text-base">/100</span>
          </div>
          <div className="text-2xl font-thin mt-4 justify-center">
            Grade:<span className="ml-2 font-bold">{grade}</span>
          </div>
        </div>

        <Button onClick={handleBack} text="Back" className="z-10" />
      </div>

      {/* ✅ Fade-in House section */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 3s ease, transform 3s ease",
        }}
      >
        <div className="bg-gray-900 border-dashed border-gray-400 p-2 border-2">
          <House />
        </div>
      </div>
    </div>
  );
}
