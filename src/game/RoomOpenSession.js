export default class RoomOpenSession {

  constructor() {
    this.reset();
  }

  setLocation(row, col) {
    this.row = row;
    this.col = col;
    this.active = true;
  }

  setFloorPlans(floorPlans) {
    this.floorPlans = floorPlans;
  }

  setSelectedFloorPlan(floorPlan) {
    this.selectedFloorPlan = floorPlan;
  }

  setUserAnswer(answerIndex) {
    if (this.userAnswer !== null) return;
    this.userAnswer = answerIndex;
    this.failed = answerIndex !== this.selectedFloorPlan.question.correctIdx;
  }

  // Reset the session
  reset() {
    this.active = false;
    this.row = null;
    this.col = null;
    this.floorPlans = [];
    this.selectedFloorPlan = null;
    this.userAnswer = null;
    this.failed = false;
  }
}