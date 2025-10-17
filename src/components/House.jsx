import { useState, useEffect } from "react";
import Room from "./Room";
import { subscribeKeyboard } from "../input/controls";

export default function House({ manager }) {
  // Keep track of state from manager
  const [state, setState] = useState(manager.getState());

  useEffect(() => {
    // --- Reactively update when manager notifies ---
    const unsubscribeManager = manager.subscribe((newState) => {
      setState({ ...newState });
    });

    // --- Keyboard control subscription ---
    const unsubscribeKeyboard = subscribeKeyboard((key) => {
      const [cr, cc] = manager.currentPosition;
      let targetRow = cr;
      let targetCol = cc;

      switch (key) {
        case "w":
          targetRow = cr - 1;
          break;
        case "s":
          targetRow = cr + 1;
          break;
        case "a":
          targetCol = cc - 1;
          break;
        case "d":
          targetCol = cc + 1;
          break;
        default:
          return;
      }

      manager.moveTo(targetRow, targetCol);
    });

    // Cleanup both subscriptions
    return () => {
      unsubscribeManager();
      unsubscribeKeyboard();
    };
  }, [manager]);

  const { rooms } = state;

  return (
    <div className="grid grid-cols-5 gap-1">
      {rooms.map((row, r) =>
        row.map((room, c) => (
          <Room
            key={`${r}-${c}`}
            room={room}
            onClick={() => {
              manager.moveTo(r, c);
            }}
          />
        ))
      )}
    </div>
  );
}
