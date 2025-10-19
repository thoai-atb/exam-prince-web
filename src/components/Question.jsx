import React, { useState, useEffect } from "react";
import KeyboardButton from "./KeyBoardButton";
import { subscribeKeyboard } from "../input/controls";

export default function Question({
  question,
  userAnswer,
  handleAnswerClick,
  handleProceed,
  isDrafting,
  cheat = false,
}) {
  const [highlightIndex, setHighlightIndex] = useState(0);

  const displayProceedBtn = userAnswer !== null && isDrafting;

  // ✅ keyboard control logic
  useEffect(() => {
    const unsubscribeKeyboard = subscribeKeyboard((key) => {
      if (!question || !question.answers) return;

      switch (key) {
        case "w":
          // move up
          if (userAnswer === null) {
            setHighlightIndex(
              (prev) => (prev - 1 + question.answers.length) % question.answers.length
            );
          }
          break;

        case "s":
          // move down
          if (userAnswer === null) {
            setHighlightIndex(
              (prev) => (prev + 1) % question.answers.length
            );
          }
          break;

        case "e":
          // select or go back
          if (userAnswer === null && highlightIndex >= 0) {
            handleAnswerClick(highlightIndex);
          } else if (displayProceedBtn) {
            handleProceed();
          }
          break;

        default:
          break;
      }
    });

    return () => unsubscribeKeyboard();
  }, [
    question,
    userAnswer,
    highlightIndex,
    displayProceedBtn,
    handleAnswerClick,
    handleProceed,
  ]);

  if (!question) return null;

  return (
    <div className="mt-4 w-full max-w-md bg-gray-900 p-4 rounded-md space-y-3 transition-none">
      <h3 className="text-md font-semibold">{question.concept}</h3>
      <p className="text-sm">{question.question}</p>

      {/* Answers */}
      <div className="flex flex-col gap-2 mt-2 text-xs">
        {question.answers.map((answer, idx) => {
          let displayAnswer = answer;

          // append marker if cheat is enabled
          if (cheat && idx === question.correctIdx) {
            displayAnswer += " 🔰";
          }

          let bgClass = "bg-gray-700 hover:bg-gray-600";

          if (userAnswer !== null && idx === userAnswer) {
            bgClass =
              question.isCorrect && question.isCorrect(userAnswer)
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white";
          } else if (userAnswer === null && idx === highlightIndex) {
            bgClass = "bg-gray-600 text-white";
          }

          const cursorClass = userAnswer === null ? "cursor-pointer" : "";

          return (
            <div
              key={idx}
              className={`p-2 ${cursorClass} rounded-sm text-left w-full ${bgClass}`}
              onClick={() => handleAnswerClick(idx)}
            >
              {displayAnswer}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {userAnswer !== null && question.explanation && (
        <div className="mt-2 text-xs italic text-gray-300">
          {question.explanation}
        </div>
      )}

      {/* Proceed Button */}
      {displayProceedBtn && (
        <div className="mt-4 w-full flex justify-center transition-opacity duration-700">
          <div
            className="bg-gray-800 px-12 py-2 hover:bg-gray-500 cursor-pointer text-white rounded-md transition-all"
            onClick={handleProceed}
          >
            Confirm
          </div>
          <div className="flex justify-center items-center mx-2 text-gray-500">
            <KeyboardButton>E</KeyboardButton>
          </div>
        </div>
      )}

      {/* Keyboard Instructions */}
      {
        userAnswer === null && (
          <p className="mt-4 text-xs text-gray-400 text-center">
            <KeyboardButton>W</KeyboardButton> <KeyboardButton>S</KeyboardButton> to move,{" "}
            <KeyboardButton>E</KeyboardButton> to select
          </p>

        )
      }
    </div>
  );
}
