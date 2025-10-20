import React, { useState, useEffect } from "react";
import Button from "./Button";
import { subscribeKeyboard } from "../input/controls";
import KeyboardButton from "./KeyBoardButton";
import { useHouseManager } from "../pages/HouseContainer";

export default function ExitModal({ visible, onConfirm, onCancel }) {
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 = Cancel, 1 = Exit

  const house = useHouseManager().current;
  const topic = house.topic.topic;
  const roomsDiscovered = house.roomsDiscovered;
  const correct = house.roomsDiscovered - house.roomsFailed;
  const wrong = house.roomsFailed;
  const score = Math.floor((correct * 100) / roomsDiscovered);

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed w-full h-full bg-black opacity-50" />
      <div className="bg-gray-900 text-white rounded-lg p-6 w-96 shadow-lg z-50">
        <h2 className="text-lg font-bold mb-4 text-center">Confirm Exit</h2>
        <p className="text-sm text-center">
          Are you sure you want to quit?<br />Better luck next semester!
        </p>

        <div className="p-6 rounded-md shadow-lg w-80 font-serif text-center space-y-3 z-10">
          <div>
            <span className="font-bold text-xl mr-1">{roomsDiscovered}</span> rooms discovered
          </div>
          <div>
            <span className="font-bold text-xl mr-1">{correct}</span> correct answer(s)
          </div>
          <div>
            <span className="font-bold text-xl mr-1">{wrong}</span> incorrect answer(s)
          </div>
        </div>

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
      </div>
    </div>
  );
}
