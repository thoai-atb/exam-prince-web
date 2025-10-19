import React, { useState, useEffect } from "react";
import Button from "./Button";
import { subscribeKeyboard } from "../input/controls";
import KeyboardButton from "./KeyBoardButton";

export default function ExitModal({ visible, onConfirm, onCancel }) {
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 = Cancel, 1 = Exit

  useEffect(() => {
    if (!visible) return;

    const unsubscribe = subscribeKeyboard((key) => {
      switch (key.toLowerCase()) {
        case "a": // move left
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "d": // move right
          setSelectedIndex((prev) => (prev < 1 ? prev + 1 : prev));
          break;
        case "e": // select
          if (selectedIndex === 0) onCancel();
          else onConfirm();
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, [visible, selectedIndex, onCancel, onConfirm]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="fixed w-full h-full bg-black opacity-50" />
      <div className="bg-gray-700 text-white rounded-lg p-6 w-80 shadow-lg z-50">
        <h2 className="text-lg font-bold mb-4 text-center">Confirm Exit</h2>
        <p className="text-sm mb-6 text-center">
          Are you sure you want to exit the house? Exiting will be considered an exam failure.
        </p>

        <div className="flex gap-4 justify-center mb-4">
          <Button
            onClick={onCancel}
            text="Cancel"
            highLight={selectedIndex === 0}
          />
          <Button
            onClick={onConfirm}
            text="Exit"
            highLight={selectedIndex === 1}
          />
        </div>

        <div className="flex justify-center items-center text-xs text-gray-300 gap-1">
          <span>Use</span>
          <KeyboardButton>A</KeyboardButton>
          <span>/</span>
          <KeyboardButton>D</KeyboardButton>
          <span>to select,</span>
          <KeyboardButton>E</KeyboardButton>
          <span>to confirm</span>
        </div>
      </div>
    </div>
  );
}
