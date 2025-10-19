import React, { useState, useEffect } from "react";
import { useHouseManager } from "../context/HouseManagerContext";
import ItemDictionary from "../game/ItemDictionary";

export default function ItemPanel() {
  const [items, setItems] = useState({});
  const houseManagerRef = useHouseManager();

  useEffect(() => {
    const manager = houseManagerRef.current;
    if (!manager) return;

    const update = () => {
      setItems({ ...manager.items }); // Create a new object so React detects the change
    };

    const unsubscribe = manager.subscribe(() => {
      update();
    });

    update();

    return () => unsubscribe();
  }, [houseManagerRef]);

  return (
    <div className="flex flex-col gap-4 w-40">
      {Object.keys(items).map((id, i) => (
        <div
          key={i}
          className="flex flex-row text-xl gap-2 items-center rounded-lg"
        >
          {/* Count */}
          <span className="font-bold text-yellow-400">{items[id]}</span>
          <span>{ItemDictionary.get(id).icon}</span>
          <span className="text-sm text-gray-300">{ItemDictionary.get(id).name}</span>
        </div>
      ))}
    </div>
  );
}

// --- Mock items for testing ---
const mockItems = [
  { id: 1, name: "Answer Sheet", icon: "📜" },
  { id: 2, name: "Pencil", icon: "✏️" },
  { id: 3, name: "Ruler", icon: "📏" },
  { id: 4, name: "Eraser", icon: "🩹" },
  { id: 5, name: "Pencil", icon: "✏️" },
  { id: 6, name: "Pencil", icon: "✏️" },
];
