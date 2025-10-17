import HouseGenerator from "./HouseGenerator.js";
import FloorPlan from "./FloorPlan.js";
import Room from "./Room.js";

export default class HouseManager {
  constructor(rows = 9, cols = 5, start = [8, 2]) {
    this.rows = rows;
    this.cols = cols;
    this.currentPosition = start;

    this.generator = new HouseGenerator(rows, cols, 100);

    // Initialize empty rooms
    this.rooms = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => new Room({ row: r, col: c }))
    );

    // Listeners for house updates
    this.listeners = new Set();

    // Object to hold currently "drafted" floorplans during selection
    this.openRoomRequest = null;

    // Open starting room immediately
    this.createEntrance();
    this.updateEnterableRooms();
  }

  // --- 🔔 React integration helpers
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners of state change
  notify() {
    for (const fn of this.listeners) fn(this.getState());
  }

  createEntrance() {
    const row = 8;
    const col = 2;

    // Create a special FloorPlan for the entrance
    const entranceFloorPlan = new FloorPlan({
      name: "Start",
      color: "white",
      doors: { north: true, south: true, west: true, east: true },
    });

    const room = this.rooms[row][col];
    room.open(entranceFloorPlan); // mark it opened with the floorplan
    this.currentPosition = [row, col];
    this.markCurrent([row, col]);
    this.updateEnterableRooms();
  }

  startOpenRoom(row, col) {
    if (this.openRoomRequest) {
      throw new Error("Finish the previous openRoom request before opening a new room");
    }

    const [cr, cc] = this.currentPosition;
    let mustConnect = {
      north: row === cr + 1 && col === cc,
      south: row === cr - 1 && col === cc,
      west: row === cr && col === cc + 1,
      east: row === cr && col === cc - 1,
    };

    const floorplans = this.generator.draftValidFloorPlans(mustConnect, row, col, 3);
    if (floorplans.length === 0) {
      throw new Error(`No valid floorplans available for room at row ${row}, col ${col}`);
    }

    // Store the full floorplan objects
    this.openRoomRequest = { row, col, floorplans };

    this.notify();

    return floorplans.map(fp => fp.clone()); // Return copies for UI
  }

  endOpenRoom(selectedFloorPlanName) {
    if (!this.openRoomRequest) {
      throw new Error("No openRoomRequest in progress");
    }

    const { row, col, floorplans } = this.openRoomRequest;

    // Find the selected floorplan object
    const selectedFP = floorplans.find(fp => fp.name === selectedFloorPlanName);
    if (!selectedFP) {
      throw new Error(`Selected floorplan ${selectedFloorPlanName} is not in the drafted options`);
    }

    // Remove from generator pool and apply to the room
    const floorplan = this.generator.useFloorPlan(selectedFP.name);
    this.rooms[row][col].open(floorplan);

    // Update position and enterable rooms
    this.markCurrent([row, col]);
    this.currentPosition = [row, col];
    this.updateEnterableRooms();

    // Clear request
    this.openRoomRequest = null;

    this.notify();
  }

  markCurrent([r, c]) {
    this.rooms = this.rooms.map(row =>
      row.map(room => {
        const clone = room.clone();
        clone.setCurrent(false);
        return clone;
      })
    );
    this.rooms[r][c].setCurrent(true);
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
          directionFromCurrent = 'north';
          oppositeDirection = 'south';
        } else if (rowIndex === cr + 1 && colIndex === cc) {
          directionFromCurrent = 'south';
          oppositeDirection = 'north';
        } else if (rowIndex === cr && colIndex === cc - 1) {
          directionFromCurrent = 'west';
          oppositeDirection = 'east';
        } else if (rowIndex === cr && colIndex === cc + 1) {
          directionFromCurrent = 'east';
          oppositeDirection = 'west';
        }

        const currentRoom = this.rooms[cr][cc];

        const canEnter =
          clone.opened
            ? !clone.current
            : currentRoom.hasDoor(directionFromCurrent);

        const canWalk =
          clone.opened && clone.hasDoor(oppositeDirection) && currentRoom.hasDoor(directionFromCurrent);

        clone.openable = !clone.opened && canEnter;
        clone.walkable = canWalk;

        return clone;
      })
    );
  }

  moveTo(newRow, newCol) {
    const target = this.rooms[newRow]?.[newCol];
    if (!target) return false;
    if (!target.openable && !target.walkable) return false;

    if (!target.opened) {
      this.startOpenRoom(newRow, newCol); // user should select floorplan next
    } else {
      this.markCurrent([newRow, newCol]);
      this.currentPosition = [newRow, newCol];
      this.updateEnterableRooms();
      this.notify();
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
