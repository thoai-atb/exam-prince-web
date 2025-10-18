// src/game/controls.js
const subscribers = new Set();

function handleKeyDown(e) {
  const key = e.key.toLowerCase();
  if (["w", "a", "s", "d", "e"].includes(key)) {
    subscribers.forEach((cb) => cb(key));
  }
}

export function subscribeKeyboard(cb) {
  if (subscribers.size === 0) {
    // Attach listener only once
    window.addEventListener("keydown", handleKeyDown);
  }

  subscribers.add(cb);

  // Return unsubscribe function
  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0) {
      window.removeEventListener("keydown", handleKeyDown);
    }
  };
}
