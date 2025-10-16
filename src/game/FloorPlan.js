export default class FloorPlan {
  constructor({
    name = "",
    color = null,
    doors = { north: false, south: false, east: false, west: false },
  } = {}) {
    this.name = name;
    this.color = color;
    this.doors = { ...doors };
  }

  // Clone for immutability
  clone() {
    return new FloorPlan({
      name: this.name,
      color: this.color,
      doors: { ...this.doors },
    });
  }

  hasDoor(direction) {
    return !!this.doors[direction];
  }
}
