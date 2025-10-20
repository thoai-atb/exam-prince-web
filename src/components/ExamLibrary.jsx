import React, { useEffect } from "react";
import KeyboardButton from "./KeyBoardButton";
import { subscribeKeyboard } from "../input/controls";

export default function Library() {
  return (
    <div className="mt-4 flex flex-col text-start gap-4 text-base text-gray-300 bg-gray-900 w-full p-6 rounded-md">
      <p className="font-semibold text-white text-center">🏛️ Exam Library</p>

      <p className="mt-2">
        Welcome to the exam library, a special room in this house.
      </p>

      <p className="mt-2">
        This house contains <i>53</i> floor plans: <i>50</i> with questions, 3 special rooms including entrance, submission and library.
      </p>

      <p className="mt-2">
        Once a floor plan is used, it is <i>removed</i> from the pool and cannot be drafted again. Use this to your advantage.
      </p>

      <p className="mt-2">
        The <i>longest</i> answer is usually the correct answer.
      </p>
    </div>
  );
}
