import { forwardRef, useImperativeHandle, useState } from "react";
import Room from "./Room";

const House = forwardRef(({ manager }, ref) => {
  const [rooms, setRooms] = useState(manager.rooms);

  // Expose method to update rooms externally
  useImperativeHandle(ref, () => ({
    updateRooms: (newRooms) => setRooms(newRooms),
  }));

  const handleMove = (row, col) => {
    const moved = manager.moveTo(row, col);
    if (moved) setRooms([...manager.rooms]);
  };

  return (
    <div className={`grid grid-cols-5 gap-1`}>
      {rooms.map((row, rowIndex) =>
        row.map((room, colIndex) => (
          <Room
            key={`${rowIndex}-${colIndex}`}
            room={room}
            onClick={() => handleMove(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
});

export default House;
