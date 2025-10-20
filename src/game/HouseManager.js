import HouseGenerator from "./HouseGenerator.js";
import FloorPlan from "./FloorPlan.js";
import Room from "./Room.js";
import RoomOpenSession from "./RoomOpenSession.js";

export default class HouseManager {
  constructor(topic, rows = 9, cols = 5, start = [8, 2], end = [0, 2]) {
    this.rows = rows;
    this.cols = cols;
    this.currentPosition = start;
    this.entrancePosition = start;
    this.submissionPosition = end;
    this.exiting = false;
    this.submitted = false;
    this.topic = topic.data;
    this.startTimeStamp = new Date();
    this.endTimeStamp = new Date();

    // Pass the topic data to HouseGenerator
    this.generator = new HouseGenerator(rows, cols, 100, this.topic);

    // Initialize empty rooms
    this.rooms = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => new Room({ row: r, col: c }))
    );

    // Listeners for house updates
    this.listeners = new Set();

    // Object to hold currently "drafted" floorplans during selection
    this.roomOpenSession = new RoomOpenSession();

    // Items collected on the way
    this.items = {
      // ruler: 1,
      // eraser: 1
    };

    // Statistics
    this.roomsDiscovered = 0;
    this.roomsFailed = 0;

    // Open starting room immediately
    this.createEntrance();
    this.createSubmission();
    this.updateEnterableRooms();
  }

  // --- 🔔 React integration helpers
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const fn of this.listeners) fn(this.getState());
  }

  getState() {
    return {
      rooms: this.rooms,
      currentPosition: this.currentPosition,
      exiting: this.exiting,
      items: this.items,
      submitted: this.submitted,
      roomsDiscovered: this.roomsDiscovered,
      roomsFailed: this.roomsFailed
    };
  }

  getCurrentFloorPlan() {
    const [r, c] = this.currentPosition;
    return this.rooms[r][c].floorplan;
  }

  isDrafting() {
    return this.roomOpenSession?.active;
  }

  createEntrance() {
    const [row, col] = this.entrancePosition;

    // ✅ Use the topic name dynamically
    const entranceFloorPlan = new FloorPlan({
      id: "FP-0",
      name: this.topic?.topic?.toUpperCase() || "START",
      color: "#444444",
      doors: { north: true, south: true, west: true, east: true },
      question: null,
      special: "entrance",
    });

    const room = this.rooms[row][col];
    room.open(entranceFloorPlan);

    this.setCurrentLocation(row, col);
  }

  createSubmission() {
    const [row, col] = this.submissionPosition;

    // ✅ Use the topic name dynamically
    const submissionFloorPlan = new FloorPlan({
      id: "FP-52",
      name: "EXAM SUBMISSION",
      color: "#AAAAAA",
      doors: { north: false, south: true, west: true, east: true },
      question: null,
      special: "submission",
    });

    const room = this.rooms[row][col];
    room.open(submissionFloorPlan);
  }

  // MAIN STEPS: [openRoom] -> selectFloorPlan -> setUserAnswer -> useFloorPlan
  openRoom(row, col) {
    if (this.roomOpenSession.floorPlans.length > 0) {
      throw new Error(
        "Finish the previous openRoomSession before opening a new room"
      );
    }

    const [cr, cc] = this.currentPosition;
    let mustConnect = {
      north: row === cr + 1 && col === cc,
      south: row === cr - 1 && col === cc,
      west: row === cr && col === cc + 1,
      east: row === cr && col === cc - 1,
    };

    const floorplans = this.generator.draftValidFloorPlans(
      mustConnect, row, col, 3
    );
    if (floorplans.length === 0) {
      throw new Error(
        `No valid floorplans available for room at row ${row}, col ${col}`
      );
    }

    this.roomOpenSession.setLocation(row, col);
    this.roomOpenSession.setFloorPlans(floorplans);
    this.updateRooms();
    this.notify();
  }

  // OPTIONAL BRANCH: openRoom -> [sketch more] -> selectFloorPlan
  sketchMoreFloorPlan() {
    if (!this.canSketchMore())
      return;
    const row = this.roomOpenSession.row;
    const col = this.roomOpenSession.col;
    const [cr, cc] = this.currentPosition;
    let mustConnect = {
      north: row === cr + 1 && col === cc,
      south: row === cr - 1 && col === cc,
      west: row === cr && col === cc + 1,
      east: row === cr && col === cc - 1,
    };
    const newFloorPlans = this.generator.draftValidFloorPlans(
      mustConnect, row, col, 1, this.roomOpenSession.floorPlans);
    if (newFloorPlans.length === 0) {
      throw new Error(
        `No valid floorplans available for room at row ${row}, col ${col}`
      );
    }
    this.items.ruler -= 1;
    this.roomOpenSession.addFloorPlan(newFloorPlans[0]);
    this.notify();
  }

  canSketchMore() {
    return this.roomOpenSession.floorPlans.length &&
      !this.roomOpenSession.selectedFloorPlan &&
      this.items.ruler > 0;
  }

  // MAIN STEPS: openRoom -> [selectFloorPlan] -> setUserAnswer -> useFloorPlan
  selectFloorPlan(selectedFloorPlanName) {
    if (!this.roomOpenSession.floorPlans.length) {
      throw new Error("No floor plans in the session");
    }

    const { floorPlans } = this.roomOpenSession;

    const selectedFP = floorPlans.find(
      (fp) => fp.name === selectedFloorPlanName
    );

    if (!selectedFP) {
      throw new Error(
        `Selected floor plan ${selectedFloorPlanName} is not in the drafted options`
      );
    }

    if (selectedFP.cost > 0) {
      if (this.items.pencil < selectedFP.cost) {
        throw new Error("Not enough pencils to draft floor plan");
      }
      this.items.pencil -= selectedFP.cost;
    }

    this.roomOpenSession.setSelectedFloorPlan(selectedFP);
    if (selectedFP.special) {
      this.useFloorPlan();
    } else {
      this.notify();
    }
  }

  // MAIN STEPS: openRoom -> selectFloorPlan -> [setUserAnswer] -> useFloorPlan
  setUserAnswer(index) {
    if (this.roomOpenSession.userAnswer !== null) return;
    this.roomOpenSession.setUserAnswer(index);
    this.notify();
  }

  // OPTIONAL BRANCH: openRoom -> selectFloorPlan -> setUserAnswer -> [eraseAnswer] -> setUserAnswer
  eraseAnswer() {
    if (!this.erasable())
      return;
    this.items.eraser -= 1;
    this.roomOpenSession.clearUserAnswer();
    this.notify();
  }

  erasable() {
    return this.roomOpenSession.userAnswer !== null &&
      this.items.eraser > 0 &&
      !this.roomOpenSession.isCorrect(this.roomOpenSession.userAnswer);
  }

  // MAIN STEPS: openRoom -> selectFloorPlan -> setUserAnswer -> [useFloorPlan]
  useFloorPlan() {
    if (!this.roomOpenSession?.selectedFloorPlan) return;

    const floorplan = this.generator.useFloorPlan(
      this.roomOpenSession.selectedFloorPlan.id
    );
    const [row, col] = [this.roomOpenSession.row, this.roomOpenSession.col];
    this.rooms[row][col].open(floorplan);
    const failed = this.roomOpenSession.failed;

    this.roomOpenSession.reset();
    this.roomsDiscovered += 1;

    // Fail or not?
    if (failed) {
      this.rooms[row][col].failed = true;
      this.roomsFailed += 1;
      this.refresh();
    } else {
      for (const item of floorplan.items) {
        this.addItem(item)
      }
      this.setCurrentLocation(row, col);
    }
  }

  setCurrentLocation(row, col) {
    this.currentPosition = [row, col];
    this.refresh();
  }

  refresh() {
    this.updateRooms();
    this.updateEnterableRooms();
    this.notify();
  }

  updateRooms() {
    this.rooms = this.rooms.map((row) =>
      row.map((room) => {
        const clone = room.clone();
        clone.setCurrent(false);
        return clone;
      })
    );
    const [r, c] = this.currentPosition;
    this.rooms[r][c].setCurrent(true);
    if (this.roomOpenSession.active) {
      const [sr, sc] = [this.roomOpenSession.row, this.roomOpenSession.col];
      this.rooms[sr][sc].setBeingDrafted(true);
    }
  }

  updateEnterableRooms() {
    const [cr, cc] = this.currentPosition;

    this.rooms = this.rooms.map((row, rowIndex) =>
      row.map((room, colIndex) => {
        const clone = room.clone();

        const isAdjacent =
          (Math.abs(rowIndex - cr) === 1 && colIndex === cc) ||
          (Math.abs(colIndex - cc) === 1 && rowIndex === cr);

        if (!isAdjacent) {
          clone.openable = false;
          clone.walkable = false;
          return clone;
        }

        let directionFromCurrent;
        let oppositeDirection;
        if (rowIndex === cr - 1 && colIndex === cc) {
          directionFromCurrent = "north";
          oppositeDirection = "south";
        } else if (rowIndex === cr + 1 && colIndex === cc) {
          directionFromCurrent = "south";
          oppositeDirection = "north";
        } else if (rowIndex === cr && colIndex === cc - 1) {
          directionFromCurrent = "west";
          oppositeDirection = "east";
        } else if (rowIndex === cr && colIndex === cc + 1) {
          directionFromCurrent = "east";
          oppositeDirection = "west";
        }

        const currentRoom = this.rooms[cr][cc];

        const canEnter = clone.opened
          ? !clone.current
          : currentRoom.hasDoor(directionFromCurrent);

        const canWalk =
          clone.opened &&
          clone.hasDoor(oppositeDirection) &&
          currentRoom.hasDoor(directionFromCurrent);

        clone.openable = !clone.opened && canEnter;
        clone.walkable = canWalk;

        return clone;
      })
    );
  }

  moveTo(newRow, newCol) {
    if (this.roomOpenSession.active) return false;
    if (this.exiting || this.submitted) return false;

    // Exiting the House
    const [er, ec] = this.entrancePosition;
    if (newRow === er + 1 && newCol === ec) {
      this.exitHouse();
      return false;
    }

    const target = this.rooms[newRow]?.[newCol];
    if (!target) return false;
    if (target.failed) return false;
    if (!target.openable && !target.walkable) return false;

    if (!target.opened) {
      this.openRoom(newRow, newCol);
    } else {
      this.setCurrentLocation(newRow, newCol);
    }

    return true;
  }

  addItem(itemId) {
    if (this.items[itemId] === undefined)
      this.items[itemId] = 0;
    this.items[itemId] += 1;
  }

  submit() {
    this.submitted = true;
    this.notify();
  }

  exitHouse() {
    this.exiting = true;
    this.notify();
  }

  cancelExit() {
    this.exiting = false;
    this.notify();
  }
}
