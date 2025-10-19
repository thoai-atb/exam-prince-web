import React, { useState, useEffect, useRef } from "react";

export default function InfoTooltip({ title, description }) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative cursor-pointer select-none"
      onClick={() => setIsOpen((prev) => !prev)}
      ref={tooltipRef}
    >
      {/* circular info badge */}
      <div className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-400 text-gray-400 text-xs font-bold hover:border-blue-400 hover:text-blue-400 transition-colors">
        i
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm p-2 rounded-lg shadow-lg w-48 z-50">
          <div className="font-semibold mb-1">{title}</div>
          <div className="text-gray-300 text-xs">
            {description || "No description available."}
          </div>
        </div>
      )}
    </div>
  );
}
