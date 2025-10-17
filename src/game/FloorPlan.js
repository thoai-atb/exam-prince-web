export default class FloorPlan {
  constructor({
    id = null,
    name = "",
    color = null,
    doors = { north: false, south: false, east: false, west: false },
    question = null, // can hold a Question object or null
  } = {}) {
    this.id = id ? id : Math.floor(Math.random() * 1e9);
    this.name = name;
    this.color = color;
    this.doors = { ...doors };
    this.question = question; // 🧩 new attribute
  }

  // Clone for immutability
  clone() {
    return new FloorPlan({
      id: this.id,
      name: this.name,
      color: this.color,
      doors: { ...this.doors },
      question: this.question ? { ...this.question } : null, // shallow clone to preserve question
    });
  }

  hasDoor(direction) {
    return !!this.doors[direction];
  }
}
