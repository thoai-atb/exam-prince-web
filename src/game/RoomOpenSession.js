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

  addFloorPlan(floorPlan) {
    this.floorPlans.push(floorPlan);
  }

  setSelectedFloorPlan(floorPlan) {
    this.selectedFloorPlan = floorPlan;
  }

  setUserAnswer(answerIndex) {
    if (this.userAnswer !== null) return;
    this.userAnswer = answerIndex;
    if (!this.selectedFloorPlan)
      return false;
    this.failed = answerIndex !== this.selectedFloorPlan.question.correctIdx;
    return !this.failed;
  }

  isCorrect(answerIndex) {
    return answerIndex === this.selectedFloorPlan.question.correctIdx;
  }

  clearUserAnswer() {
    this.userAnswer = null;
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