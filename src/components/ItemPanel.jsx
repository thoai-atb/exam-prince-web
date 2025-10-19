import React, { useState, useEffect, useRef } from "react";
import { useHouseManager } from "../pages/HouseContainer";
import ItemDictionary from "../game/ItemDictionary";
import InfoTooltip from "./InfoTooltip";

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

      for (const id of Object.keys(newItems)) {
        if (newItems[id] !== (prevItemsRef.current[id] || 0)) {
          newFlashIds.add(id);
        }
      }

      prevItemsRef.current = newItems;
      setItems(newItems);
      setFlashIds(newFlashIds);

      setTimeout(() => setFlashIds(new Set()), 300);
    };

    const unsubscribe = manager.subscribe(() => update());
    update();
    return () => unsubscribe();
  }, [houseManagerRef]);

  return (
    <div className="flex flex-col gap-4 w-48">
      {Object.keys(items).filter(key => items[key] > 0).map((id, i) => {
        const itemInfo = ItemDictionary.get(id);

        return (
          <div
            key={i}
            className={`group relative flex flex-row px-2 ${
              flashIds.has(id) ? "bg-gray-500" : ""
            } duration-700 transition-all text-xl gap-2 h-12 items-center rounded-lg`}
          >
            <span className="text-yellow-300 font-bold">{items[id]}</span>
            <span>{itemInfo.icon}</span>
            <span className="text-sm text-gray-300">{itemInfo.name}</span>

            {/* Hide info until hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <InfoTooltip
                title={itemInfo.name}
                description={itemInfo.description}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
