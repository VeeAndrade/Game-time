class Round {
  constructor() {
    this.categories = [];
    this.clues = [];
    this.count = 0;
  }

  updateCount() {
    this.count++;
  }
}

module.exports = Round;
