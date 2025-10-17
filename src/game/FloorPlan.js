export default class FloorPlan {
  constructor({
    name = "",
    color = null,
    doors = { north: false, south: false, east: false, west: false },
    question = null, // can hold a Question object or null
  } = {}) {
    this.name = name;
    this.color = color;
    this.doors = { ...doors };
    this.question = question; // 🧩 new attribute
  }

  // Clone for immutability
  clone() {
    return new FloorPlan({
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
