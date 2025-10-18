import React from "react";
import KeyboardButton from "./KeyBoardButton";

export default function ExamSubmission({ onSubmit }) {
  return (
    <div className="mt-4 flex flex-col text-start gap-4 text-sm text-gray-300 bg-gray-900 w-full p-6 rounded-md">
      <p className="font-semibold text-white mb-1 text-center">🏛️ Exam Submission</p>

      <p>This is where you submit your exam papers.</p>

      <p className="mt-2">
        You are REQUIRED to have an <b>answer sheet</b> to finish the submission process.
      </p>

      <p className="mt-2">
        There are 2 rooms that has <b>answer sheet</b> somewhere in this house.
      </p>

      <div className="w-full flex justify-center items-center">
        <div
          className="bg-gray-800 text-center py-2 w-1/2 hover:bg-gray-500 cursor-pointer text-white rounded-md transition-all"
          onClick={() => onSubmit()}
        >
          Submit answer sheet
        </div>
      </div>
    </div>
  );
}
