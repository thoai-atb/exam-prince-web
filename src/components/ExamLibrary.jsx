import React, { useEffect } from "react";
import KeyboardButton from "./KeyBoardButton";
import { subscribeKeyboard } from "../input/controls";

export default function Library() {
  return (
    <div className="mt-4 flex flex-col text-start gap-4 text-sm text-gray-300 bg-gray-900 w-full p-6 rounded-md">
      <p className="font-semibold text-white mb-2 text-center">🏛️ Exam Library</p>

      <p className="mt-2">
        Welcome to the exam library, this is the special room in this house.        
      </p>

      <p className="mt-2">
        This house contains <i>50</i> floor plans with <i>50</i>  questions, each corresponds to a concept in the topic.
      </p>

      <p className="mt-2">
        Once a floor plan is used, it is <i>removed</i> from the pool and cannot be drafted again.
      </p>

      <p className="mt-2">
        The <i>longest</i> answer is usually the correct answer.
      </p>

      <p className="mt-2">
        Discover as many rooms as possible early in the game to get items, dead-end rooms are helpful as the always contains pencils.
      </p>
    </div>
  );
}
