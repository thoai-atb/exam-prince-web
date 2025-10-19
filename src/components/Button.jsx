import React from "react";

export default function Button({ onClick, text, highLight = false}) {
  const bgClass = highLight ? "bg-gray-500" : "bg-gray-800 hover:bg-gray-500";
  return (
    <div
      onClick={onClick}
      className={`
        ${bgClass} text-white text-center py-2 w-1/2
        hover:bg-gray-500 rounded-md cursor-pointer
        transition-all duration-200
      `}
    >
      {text}
    </div>
  );
}
