import React, { useState, useEffect, useRef } from "react";
import { useHouseManager } from "../context/HouseManagerContext";
import ItemDictionary from "../game/ItemDictionary";

export default function ItemPanel() {
  const [items, setItems] = useState({});
  const [flashIds, setFlashIds] = useState(new Set());
  const prevItemsRef = useRef({});
  const houseManagerRef = useHouseManager();

  useEffect(() => {
    const manager = houseManagerRef.current;
    if (!manager) return;

    const update = () => {
      const newItems = { ...manager.items };
      const newFlashIds = new Set();

      // Compare previous counts with current
      for (const id of Object.keys(newItems)) {
        if (newItems[id] !== (prevItemsRef.current[id] || 0)) {
          newFlashIds.add(id);
        }
      }

      prevItemsRef.current = newItems;
      setItems(newItems);
      setFlashIds(newFlashIds);

      // Remove flash after short delay
      setTimeout(() => setFlashIds(new Set()), 300);
    };

    const unsubscribe = manager.subscribe(() => {
      update();
    });

    update();

    return () => unsubscribe();
  }, [houseManagerRef]);

  return (
    <div className="flex flex-col gap-4 w-48">
      {Object.keys(items).map((id, i) => (
        <div
          key={i}
          className={`flex flex-row px-2 ${flashIds.has(id) ? "bg-gray-700" : ""} duration-700 transition-all text-xl gap-2 h-12 items-center rounded-lg`}
        >
          <span className={`text-yellow-300 font-bold transition-all duration-700 ${flashIds.has(id) ? "text-4xl" : "text-xl"}`}>{items[id]}</span>
          <span>{ItemDictionary.get(id).icon}</span>
          <span className="text-sm text-gray-300">{ItemDictionary.get(id).name}</span>
        </div>
      ))}
    </div>
  );
}
