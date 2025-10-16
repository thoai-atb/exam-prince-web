import React from "react";
import { useRef } from "react";
import House from "../components/House";
import HouseManager from "../game/HouseManager";

const Main = () => {
  const houseRef = useRef(null);
  const managerRef = useRef(new HouseManager());

  // Function to move the player in a direction
  const moveDirection = (direction) => {
    const [cr, cc] = managerRef.current.currentPosition;
    let targetRow = cr;
    let targetCol = cc;

    switch (direction) {
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

    const rows = managerRef.current.rows;
    const cols = managerRef.current.cols;

    // Check bounds
    if (
      targetRow < 0 ||
      targetRow >= rows ||
      targetCol < 0 ||
      targetCol >= cols
    )
      return;

    const targetRoom = managerRef.current.rooms[targetRow][targetCol];
    if (targetRoom.openable || targetRoom.walkable) {
      managerRef.current.openRoom(targetRow, targetCol);
      // Trigger re-render in House
      houseRef.current?.updateRooms([...managerRef.current.rooms]);
    }
  };

  // Handle key presses
  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    if (["w", "a", "s", "d"].includes(key)) {
      moveDirection(key);
    }
  };

  // Attach keydown listener
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center bg-gray-900 p-2">
      <div className="text-sx text-white mb-2">Use WASD to move</div>
      <House ref={houseRef} manager={managerRef.current} />
    </main>
  );
};

export default Main;
