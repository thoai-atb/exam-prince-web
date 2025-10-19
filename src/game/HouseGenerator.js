import FloorPlan from "./FloorPlan.js";
import Question from "./Question.js";
import Item from "./ItemDictionary.js";

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

    // Distribute Items
    this.distributeItem("sheet", 1);
    this.distributePencils(true);
    this.distributeItem("ruler", 6);
    this.distributeItem("eraser", 3);

    // Set cost for floor plans
    this.setCost();
  }

  distributePencils(skipEmpty = false) {
    for (const fp of this.pool) {
      // Room is not empty
      if (skipEmpty && fp.items && fp.items.length > 0)
        continue;

      const doorCount = fp.countDoors();

      // Always give 1 pencil if dead-end (1 door)
      if (doorCount === 1) {
        fp.addItem("pencil");
      }

      // 2-way: 25% chance to add 1 pencil
      else if (doorCount === 2 && Math.random() < 0.25) {
        fp.addItem("pencil");
      }
    }
  }

  distributeItem(item, count = 10, skipEmpty = false) {
    // Collect all possible room indices
    let availableIndices = this.pool.map((_, i) => i);

    // If "skipEmpty" is true → only include rooms with no items
    if (skipEmpty) {
      availableIndices = availableIndices.filter(i => {
        const fp = this.pool[i];
        return !fp.items || fp.items.length === 0; // adjust depending on your structure
      });
    }

    // If no rooms available under skipEmpty condition, stop early
    if (availableIndices.length === 0) return;

    // Choose random unique indices
    const chosenIndices = new Set();
    while (chosenIndices.size < Math.min(count, availableIndices.length)) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      chosenIndices.add(availableIndices[randomIndex]);
    }

    // Distribute the item
    for (const i of chosenIndices) {
      const fp = this.pool[i];
      fp.addItem(item);
    }
  }


  setCost() {
    for (const fp of this.pool) {
      const doorCount = fp.countDoors();

      // 4 doors always cost >= 1 pencil
      if (doorCount === 4) {
        if (Math.random() < 0.75)
          fp.cost = 2;
        else
          fp.cost = 1;
      }

      // 3-way: 50% chance cost 1 pencil
      if (doorCount === 3) {
        if (Math.random() < 0.5)
          fp.cost = 1;
        else
          fp.cost = 0;
      }
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

      const questionObject = new Question({
        topic: concept.topic,
        concept: concept.concept,
        question: question.question,
        explanation: question.explanation,
        difficulty: question.difficulty,
        correctAnswer: question.correctAnswer,
        wrongAnswers: [question.wrongAnswer1, question.wrongAnswer2, question.wrongAnswer3],
      });

      const floorPlan = new FloorPlan({ id: `FP-${i + 1}`, name, color, doors, question: questionObject });
      return floorPlan;
    });
  }

  draftValidFloorPlans(mustConnect = {}, row = 0, col = 0, count = 1, excepts = []) {
    const validPool = [];

    for (const fp of this.pool) {
      // Excepts for FP in list
      let skip = false;
      for (const fpe of excepts) {
        if(fpe.id === fp.id) {
          skip = true;
          break;
        }
      }
      if (skip) continue;

      let isValid = false;

      for (let i = 0; i < 4; i++) { // try 0°, 90°, 180°, 270°
        const hasConnection = Object.keys(mustConnect).some(
          (dir) => mustConnect[dir] && fp.hasDoor(dir)
        );

        const invalidEdge =
          (row === 0 && fp.doors.north) ||
          (row === this.rows - 1 && fp.doors.south) ||
          (col === 0 && fp.doors.west) ||
          (col === this.cols - 1 && fp.doors.east);

        if (hasConnection && !invalidEdge) {
          isValid = true;
          break;
        }

        fp.rotate(); // 🔁 mutate directly
      }

      if (isValid) validPool.push(fp);
    }

    const shuffled = validPool.sort(() => Math.random() - 0.5);
    let selected = shuffled.slice(0, count);

    // 🟩 Ensure at least one free (cost === 0) floor plan
    if (!selected.some(fp => fp.cost === 0)) {
      const freePlan = validPool.find(fp => fp.cost === 0);
      if (freePlan) {
        // Replace a random one in the selection with the free plan
        selected[Math.floor(Math.random() * selected.length)] = freePlan;
      }
    }

    return selected;
  }

  useFloorPlan(floorplanName) {
    const index = this.pool.findIndex((fp) => fp.name === floorplanName);
    if (index === -1) return null;
    const fp = this.pool[index];
    this.pool.splice(index, 1);
    return fp;
  }
}
