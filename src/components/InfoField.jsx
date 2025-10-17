// InfoField.jsx
import React from "react";

export default function InfoField({ label, value }) {
  return (
    <div>
      <span className="font-bold mr-2">{label}:</span>
      <span className="font-thin">{value}</span>
    </div>
  );
}
