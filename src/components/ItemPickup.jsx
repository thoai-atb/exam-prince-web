import React, { useEffect, useState } from "react";

export default function ItemPickup({ item, duration = 1500, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDone) onDone();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDone]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg shadow-lg animate-fade">
        <span className="text-2xl">{item.icon}</span>
        <span className="font-semibold">{item.name} acquired!</span>
      </div>
    </div>
  );
}
