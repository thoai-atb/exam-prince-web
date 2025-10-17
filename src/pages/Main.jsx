import React from "react";
import House from "../components/House";
import HouseManager from "../game/HouseManager";
import DraftPanel from "../components/DraftPanel";
import RoomPanel from "../components/RoomPanel";

const Main = () => {
  const managerRef = React.useRef(new HouseManager());

  return (
    <main className="flex flex-row gap-4">
      {/* House area */}
      <div className="flex flex-col items-center justify-center bg-gray-900 p-2">
        <House manager={managerRef.current} />
      </div>

      {/* Draft panel */}
      <div className="flex flex-row items-center justify-center p-2">
        <DraftPanel houseManagerRef={managerRef} />
        <RoomPanel houseManagerRef={managerRef} />
      </div>
    </main>
  );
};

export default Main;
