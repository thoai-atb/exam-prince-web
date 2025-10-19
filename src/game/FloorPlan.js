export default class FloorPlan {
  constructor({
    id = null,
    name = "",
    color = null,
    doors = { north: false, south: false, east: false, west: false },
    question = null, // can hold a Question object or null
    special = null, // A string
    items = [],
  } = {}) {
    this.id = id ? id : Math.floor(Math.random() * 1e9);
    this.name = name;
    this.color = color;
    this.doors = { ...doors };
    this.question = question;
    this.special = special;
    this.items = items;
  }

  // Clone for immutability
  clone() {
    return new FloorPlan({
      id: this.id,
      name: this.name,
      color: this.color,
      doors: { ...this.doors },
      question: this.question,
      special: this.special,
      items: [...this.items]
    });
  }

  hasDoor(direction) {
    return !!this.doors[direction];
  }

  countDoors() {
    const doors = Object.values(this.doors).filter(Boolean).length;
    return doors;
  }

  rotate(clockwise = true) {
    const newDoors = {};
    if (clockwise) {
      newDoors.north = this.doors.west;
      newDoors.east = this.doors.north;
      newDoors.south = this.doors.east;
      newDoors.west = this.doors.south;
    } else {
      newDoors.north = this.doors.east;
      newDoors.west = this.doors.north;
      newDoors.south = this.doors.west;
      newDoors.east = this.doors.south;
    }
    this.doors = newDoors;
  }

  addItem(item) {
    this.items.push(item);
  }
}
