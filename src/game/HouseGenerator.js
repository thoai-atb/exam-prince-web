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
   * Return up to `count` valid floorplans without removing them
   * @param {Object} mustConnect - {north, south, west, east} booleans
   * @param {Number} row
   * @param {Number} col
   * @param {Number} count
   * @returns Array of FloorPlans
   */
  draftValidFloorPlans(mustConnect = {}, row = 0, col = 0, count = 1) {
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

    // Return up to `count` floorplans randomly
    const shuffled = validPool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Removes the floorplan from the pool and returns it
   * @param {String} floorplanName
   * @returns FloorPlan
   */
  useFloorPlan(floorplanName) {
    const index = this.pool.findIndex(fp => fp.name === floorplanName);
    if (index === -1) return null;
    const fp = this.pool[index];
    this.pool.splice(index, 1);
    return fp;
  }
}
