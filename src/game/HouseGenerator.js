import FloorPlan from "./FloorPlan.js";

export default class HouseGenerator {
  constructor(rows, cols, poolSize = 100, questionsFile = null) {
    this.rows = rows;
    this.cols = cols;
    this.pool = [];

    if (questionsFile) {
      // If a file path or data is provided, generate floorplans from it
      this.loadFromQuestions(questionsFile);
    } else {
      // Default random pool
      this.pool = Array.from({ length: poolSize }, (_, i) =>
        this.generateRandomFloorPlan(i)
      );
    }
  }

  static randomColorFromString(str) {
    // Simple hash to generate consistent color
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 40%)`;
    return color;
  }

  static randomDoorsFromString(str) {
    const hash = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return {
      north: hash % 2 === 0,
      south: (hash >> 1) % 2 === 0,
      west: (hash >> 2) % 2 === 0,
      east: (hash >> 3) % 2 === 0,
    };
  }

  generateRandomFloorPlan(index) {
    return new FloorPlan({
      name: `FP-${index}`,
      color: HouseGenerator.randomColorFromString(`FP-${index}`),
      doors: HouseGenerator.randomDoorsFromString(`FP-${index}`),
    });
  }

  loadFromQuestions(questionsFile) {
    let data;
    if (typeof questionsFile === "string") {
      // If it's a path, require or fetch
      data = require(questionsFile); // for local files in Node/webpack
    } else {
      data = questionsFile; // already parsed JSON
    }

    const concepts = data.concepts || [];
    this.pool = concepts.map((concept, i) => {
      const name = concept.concept;
      const color = HouseGenerator.randomColorFromString(name);
      const doors = HouseGenerator.randomDoorsFromString(name);

      // Attach a question (pick one randomly from the concept)
      const questions = concept.questions || [];
      const question =
        questions.length > 0
          ? questions[Math.floor(Math.random() * questions.length)]
          : null;

      return new FloorPlan({ name, color, doors, question });
    });
  }

  draftValidFloorPlans(mustConnect = {}, row = 0, col = 0, count = 1) {
    const validPool = this.pool.filter((fp) => {
      const hasConnection = Object.keys(mustConnect).some(
        (dir) => mustConnect[dir] && fp.hasDoor(dir)
      );
      if (!hasConnection) return false;

      if (row === 0 && fp.doors.north) return false;
      if (row === this.rows - 1 && fp.doors.south) return false;
      if (col === 0 && fp.doors.west) return false;
      if (col === this.cols - 1 && fp.doors.east) return false;

      return true;
    });

    const shuffled = validPool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  useFloorPlan(floorplanName) {
    const index = this.pool.findIndex((fp) => fp.name === floorplanName);
    if (index === -1) return null;
    const fp = this.pool[index];
    this.pool.splice(index, 1);
    return fp;
  }
}
