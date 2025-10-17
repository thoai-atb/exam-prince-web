import React from "react";
import House from "../components/House";
import HouseManager from "../game/HouseManager";
import DraftPanel from "../components/DraftPanel";

const Main = () => {
  const managerRef = React.useRef(new HouseManager());

  return (
    <main className="flex flex-row gap-4">
      {/* House area */}
      <div className="flex flex-col items-center justify-center bg-gray-900 p-2">
        <House manager={managerRef.current} />
      </div>

      {/* Draft panel */}
      <div className="flex flex-col items-center justify-center bg-gray-900 p-2">
        <DraftPanel houseManagerRef={managerRef} />
      </div>
    </main>
  );
};

export default Main;
