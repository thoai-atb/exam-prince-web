import React from "react";
import KeyboardButton from "./KeyBoardButton";

export default function ExamEntrance({ onExit }) {
  return (
    <div className="mt-4 flex flex-col text-start gap-4 text-sm text-gray-300 bg-gray-900 w-full p-6 rounded-md">
      <p className="font-semibold text-white mb-1 text-center">🏛️ Exam Entrance</p>

      <p>Begin your drafting phase by constructing the rooms.</p>

      <p className="mt-2 flex flex-wrap items-center gap-1">
        Move:
        <KeyboardButton>W</KeyboardButton>
        <KeyboardButton>A</KeyboardButton>
        <KeyboardButton>S</KeyboardButton>
        <KeyboardButton>D</KeyboardButton>
        <span className="ml-1">or 🖱️ Mouse Clicks</span>
      </p>

      <p className="mt-2">
        Leave the house at any time to forfeit and retry the test.
      </p>

      <div className="w-full">
        <div
          className="bg-gray-800 text-center px-12 py-2 hover:bg-gray-500 cursor-pointer text-white rounded-md transition-all"
          onClick={() => onExit()}
        >
          Leave the House
        </div>
      </div>
    </div>
  );
}
