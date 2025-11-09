import React, { useEffect, useState } from "react";

// Auto-import all topics from ../topics
const topicFiles = import.meta.glob("../topics/*.json", { eager: true });

export default function TopicSelection({ onSelect }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const loadedTopics = Object.entries(topicFiles).map(([path, data]) => ({
      name: data.topic || path.split("/").pop().replace(".json", ""),
      data,
      path,
    }));
    setTopics(loadedTopics);
  }, []);

  const handleSelect = (topic) => setSelectedTopic(topic);
  const handleContinue = () => {
    if (onSelect && selectedTopic) onSelect(selectedTopic);
  };

  // --- Keyboard handling ---
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "e" && selectedTopic) {
        handleContinue();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedTopic]);

  return (
    <div className="flex flex-col gap-5 items-center text-center text-white justify-between">
      {/* 🌟 App Header */}
      <div className="flex flex-col items-center">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Exam Prince Logo"
          className="w-20 h-20 mb-2 drop-shadow-lg border-4 border-black"
        />
        <p className="text-3xl font-thin font-serif italic text-blue-400 tracking-wide">
          Exam Prince
        </p>
      </div>

      {/* 🔹 Topic Selection */}
      <div className="bg-gray-900 text-white flex flex-col items-center p-4 rounded-sm shadow-lg">
        <h2 className="text-lg font-thin mb-4">Select a Topic</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1 max-w-5xl">
          {topics.map((t, idx) => {
            const isSelected = selectedTopic?.path === t.path;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(t)}
                className={`p-3 text-center text-sm font-medium rounded-md shadow-md cursor-pointer transition-all
                  ${isSelected ? "bg-blue-600 text-white" : "bg-gray-600 hover:bg-blue-500"}
                `}
              >
                {t.name}
              </div>
            );
          })}
        </div>

        {topics.length === 0 && (
          <p className="mt-6 text-gray-400 text-xs">
            No topics found in <code>../topics/</code>
          </p>
        )}
      </div>

      {/* Continue button */}
      <div
        onClick={handleContinue}
        className={`mb-4 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 cursor-pointer font-semibold text-sm shadow-md transition-all
          ${selectedTopic ? "opacity-100  w-1/2" : "opacity-0 w-0 pointer-events-none"}
        `}
      >
        Continue
      </div>

      {/* ⚖️ Footer */}
      <footer className="text-xs text-gray-500">
        © 2025 Thoai Ly. All rights reserved.
      </footer>
    </div>
  );
}
