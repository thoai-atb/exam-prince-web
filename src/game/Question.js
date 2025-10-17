export default class Question {
  constructor({ topic, concept, question, correctAnswer, wrongAnswers, explanation, difficulty }) {
    this.topic = topic;               // e.g., "Math"
    this.concept = concept;           // e.g., "Pythagorean theorem"
    this.question = question;         // The question text
    this.explanation = explanation;   // Why the correct answer is correct
    this.difficulty = difficulty;     // e.g., "easy", "medium", "hard"

    // Combine and shuffle answers
    const { answers, correctIdx } = this.shuffleAnswers(correctAnswer, wrongAnswers);
    this.answers = answers;
    this.correctIdx = correctIdx;
  }

  // 🔀 Shuffle answers and determine correct index
  shuffleAnswers(correct, wrongs) {
    const all = [...wrongs, correct];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return {
      answers: all,
      correctIdx: all.indexOf(correct),
    };
  }

  // ✅ Check if selected answer index is correct
  isCorrect(index) {
    return index === this.correctIdx;
  }

  // ✅ Get the correct answer text
  get correctAnswer() {
    return this.answers[this.correctIdx];
  }

  // ✅ Serialize to JSON
  toJSON() {
    return {
      topic: this.topic,
      concept: this.concept,
      question: this.question,
      answers: this.answers,
      correctIdx: this.correctIdx,
      explanation: this.explanation,
      difficulty: this.difficulty,
    };
  }
}
