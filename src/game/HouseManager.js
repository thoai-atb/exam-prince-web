import HouseGenerator from "./HouseGenerator.js";
import FloorPlan from "./FloorPlan.js";
import Room from "./Room.js";
import Topic from "../questions/MusicTheory.json"; // import the JSON file
import RoomOpenSession from "./RoomOpenSession.js";

export default class HouseManager {
  constructor(rows = 9, cols = 5, start = [8, 2]) {
    this.rows = rows;
    this.cols = cols;
    this.currentPosition = start;

    // Pass the JSON data to HouseGenerator
    this.generator = new HouseGenerator(rows, cols, 100, Topic);

    // Initialize empty rooms
    this.rooms = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => new Room({ row: r, col: c }))
    );

    // Listeners for house updates
    this.listeners = new Set();

    // Object to hold currently "drafted" floorplans during selection
    this.roomOpenSession = new RoomOpenSession();

    // Open starting room immediately
    this.createEntrance();
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

  createEntrance() {
    const row = 8;
    const col = 2;

    // Use the topic name from Logic.json as the entrance floorplan name
    const entranceFloorPlan = new FloorPlan({
      id: "FP-0",
      name: Topic.topic.toUpperCase() || "Start",
      color: "#444444",
      doors: { north: true, south: true, west: true, east: true },
      question: null,
    });

    const room = this.rooms[row][col];
    room.open(entranceFloorPlan); // mark it opened with the floorplan

    this.setCurrentLocation(row, col);
  }

  // Step 1: Open room and draft floorplans
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
      mustConnect,
      row,
      col,
      3
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

    return floorplans.map((fp) => fp.clone());
  }

  // Step 2: Select the floorplan and quiz time!
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
        `Selected floorplan ${selectedFloorPlanName} is not in the drafted options`
      );
    }

    this.roomOpenSession.setSelectedFloorPlan(selectedFP);
    this.notify();
  }

  // Step 3: User selects an answer
  setUserAnswer(index) {
    if (this.roomOpenSession.userAnswer !== null)
      return;
    this.roomOpenSession.setUserAnswer(index);
    this.notify();
  }

  // Step 4: Use the selected floorplan to open the room
  useFloorPlan() {
    const floorplan = this.generator.useFloorPlan(this.roomOpenSession.selectedFloorPlan.name);
    const [row, col] = [this.roomOpenSession.row, this.roomOpenSession.col]
    this.rooms[row][col].open(floorplan);
    const failed = this.roomOpenSession.failed;
    this.roomOpenSession.reset();
    if (failed) {
      this.rooms[row][col].failed = true;
      this.refresh();
    } else
      this.setCurrentLocation(row, col);
  }

  // Set location, update rooms, and notify listeners
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
    if (this.roomOpenSession.active) {
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

  getState() {
    return {
      rooms: this.rooms,
      currentPosition: this.currentPosition,
    };
  }
}
