import HouseGenerator from "./HouseGenerator.js";
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

    // Open starting room
    this.openRoom(start[0], start[1], true);
    this.updateEnterableRooms();
  }

  openRoom(row, col, forceStart = false) {
    const room = this.rooms[row][col];

    if (!room.floorplan || forceStart) {
      let floorplan;
      if (forceStart && row === 8 && col === 2) {
        // Starting room gets 4 doors
        floorplan = this.generator.drawValidFloorPlan(
          { north: true, south: true, west: true, east: true },
          row,
          col
        );
      } else {
        // Determine connection to current room
        const [cr, cc] = this.currentPosition;
        const mustConnect = {
          north: row === cr + 1 && col === cc,
          south: row === cr - 1 && col === cc,
          west: row === cr && col === cc + 1,
          east: row === cr && col === cc - 1,
        };

        floorplan = this.generator.drawValidFloorPlan(mustConnect, row, col);

        if (!floorplan) {
          throw new Error(
            `No valid floorplan available for room at row ${row}, col ${col} with required connections: ${JSON.stringify(
              mustConnect
            )}`
          );
        }
      }

      if (floorplan) room.open(floorplan);
    } else {
      room.open(); // mark opened
    }

    this.markCurrent([row, col]);
    this.currentPosition = [row, col];
    this.updateEnterableRooms();
  }

  markCurrent([r, c]) {
    this.rooms = this.rooms.map((row) =>
      row.map((room) => {
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

        // Determine direction from current room to this room
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

        // Only enterable if current room has a door pointing toward target room
        const canEnter = currentRoom.hasDoor(directionFromCurrent);

        // Walkable: must also check that target room has a door pointing back
        const canWalk = clone.opened && clone.hasDoor(oppositeDirection) && canEnter;

        clone.openable = !clone.opened && canEnter;
        clone.walkable = canWalk && !clone.current;

        return clone;
      })
    );
  }

  moveTo(newRow, newCol) {
    const target = this.rooms[newRow]?.[newCol];
    if (!target) return false;
    if (!target.openable && !target.walkable) return false;

    this.openRoom(newRow, newCol);
    return true;
  }

  getState() {
    return {
      rooms: this.rooms,
      currentPosition: this.currentPosition,
    };
  }
}
