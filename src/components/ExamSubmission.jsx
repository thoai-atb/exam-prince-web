import React, { useEffect } from "react";
import KeyboardButton from "./KeyBoardButton";
import { subscribeKeyboard } from "../input/controls";

export default function ExamSubmission({ submitable, onSubmit }) {
  useEffect(() => {
    if (!submitable) return;

    const unsubscribe = subscribeKeyboard((key) => {
      if (key.toLowerCase() === "e") {
        onSubmit?.();
      }
    });

    return () => unsubscribe();
  }, [submitable, onSubmit]);

  return (
    <div className="mt-4 flex flex-col text-start gap-4 text-sm text-gray-300 bg-gray-900 w-full p-6 rounded-md">
      <p className="font-semibold text-white mb-2 text-center">🏛️ Exam Submission</p>

      <p>This is where you submit your exam papers.</p>

      <p className="mt-2">
        You are REQUIRED to have an <b>answer sheet</b>.
      </p>

      <p className="mt-2">
        There is only one <b>answer sheet</b> in this house.
      </p>

      {submitable && (
        <div className="w-full my-4 flex justify-center items-center gap-2">
          <div
            className="bg-gray-800 text-center py-2 w-1/2 hover:bg-gray-500 cursor-pointer text-white rounded-md transition-all"
            onClick={() => onSubmit()}
          >
            Submit answer sheet
          </div>
          <KeyboardButton>E</KeyboardButton>
        </div>
      )}
    </div>
  );
}
