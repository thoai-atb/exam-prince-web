import React from "react";
import KeyboardButton from "./KeyboardButton";

export default function ExamEntrance({ onExit }) {
  return (
    <div className="mt-4 flex flex-col text-start gap-4 text-base text-gray-300 bg-gray-900 w-full p-6 rounded-md">
      <p className="font-semibold text-white mb-1 text-center">🏛️ Exam Entrance</p>

      <p>You will walk through rooms, take questions and submit test.</p>

      <p className="mt-2">
        Once a room is opened, a floor plan must be selected and an answer must be given before continuing.
      </p>

      <p className="mt-2">
        The room will be LOCKED if the answer is incorrect.
      </p>

      <p className="mt-2">
        You can exit the house anytime and give up this exam.
      </p>

      <div className="w-full flex justify-center items-center">
        <div
          className="bg-gray-800 text-center py-2 w-1/2 hover:bg-gray-500 cursor-pointer text-white rounded-md transition-all"
          onClick={() => onExit()}
        >
          EXIT
        </div>
      </div>
    </div>
  );
}
