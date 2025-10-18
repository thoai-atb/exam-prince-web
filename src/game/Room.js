import FloorPlan from "./FloorPlan.js";

export default class Room {
  constructor({
    row = 0,
    col = 0,
    opened = false,
    openable = false,
    walkable = false,
    current = false,
    floorplan = null,
    beingDrafted = false,
    failed = false
  } = {}) {
    this.row = row;
    this.col = col;
    this.opened = opened;
    this.openable = openable;
    this.walkable = walkable;
    this.current = current;
    this.floorplan = floorplan; // may be null until room is opened
    this.beingDrafted = beingDrafted;
    this.failed = failed // if answered incorrectly
  }

  clone() {
    return new Room({
      row: this.row,
      col: this.col,
      opened: this.opened,
      openable: this.openable,
      walkable: this.walkable,
      current: this.current,
      floorplan: this.floorplan?.clone() || null,
      beingDrafted: this.beingDrafted,
      failed: this.failed
    });
  }

  open(floorplan) {
    this.opened = true;
    this.openable = false;
    if (floorplan) {
      this.floorplan = floorplan;
    }
  }

  setCurrent(isCurrent) {
    this.current = isCurrent;
  }

  setBeingDrafted(beingDrafted) {
    this.beingDrafted = beingDrafted;
  }

  /**
   * Check if the room has a door in the given direction
   * @param {string} direction - 'north', 'south', 'west', 'east'
   * @returns {boolean}
   */
  hasDoor(direction) {
    return !!this.floorplan?.hasDoor(direction);
  }
}
