import FloorPlan from "./FloorPlan.js";

export default class HouseGenerator {
  constructor(rows, cols, poolSize = 100) {
    this.rows = rows;
    this.cols = cols;

    // Pre-generate a pool of floorplans
    this.pool = Array.from({ length: poolSize }, (_, i) =>
      this.generateRandomFloorPlan(i)
    );
  }

  static randomColor() {
    const colors = [
      "#0D9488", "#2563EB", "#DC2626", "#CA8A04",
      "#7C3AED", "#BE185D", "#EA580C", "#4B5563",
      "#49e01f", "#D9D5CA", "#30302f", "#B45309",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  static randomDoors() {
    return {
      north: Math.random() < 0.5,
      south: Math.random() < 0.5,
      west: Math.random() < 0.5,
      east: Math.random() < 0.5,
    };
  }

  generateRandomFloorPlan(index) {
    return new FloorPlan({
      name: `FP-${index}`,
      color: HouseGenerator.randomColor(),
      doors: HouseGenerator.randomDoors(),
    });
  }

  /**
   * Pull a floorplan that satisfies connection directions
   * @param {Object} mustConnect - object with {north, south, west, east} boolean
   * @param {Number} row - room row
   * @param {Number} col - room col
   * @returns FloorPlan or null
   */
  drawValidFloorPlan(mustConnect = {}, row = 0, col = 0) {
    const validPool = this.pool.filter(fp => {
      // Must have at least one required door
      const hasConnection = Object.keys(mustConnect).some(
        dir => mustConnect[dir] && fp.hasDoor(dir)
      );
      if (!hasConnection) return false;

      // Must not have doors pointing outside the house
      if (row === 0 && fp.doors.north) return false;
      if (row === this.rows - 1 && fp.doors.south) return false;
      if (col === 0 && fp.doors.west) return false;
      if (col === this.cols - 1 && fp.doors.east) return false;

      return true;
    });

    if (validPool.length === 0) return null;

    const idx = Math.floor(Math.random() * validPool.length);
    const fp = validPool[idx];
    this.pool.splice(this.pool.indexOf(fp), 1); // remove from pool
    return fp;
  }
}
