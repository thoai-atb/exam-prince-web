import React from "react";

export default function KeyboardButton({ children }) {
  return (
    <kbd className="bg-gray-600 text-white px-2 py-1 rounded-md shadow-md text-xs font-mono">
      {children}
    </kbd>
  );
}
