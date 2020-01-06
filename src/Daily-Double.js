const Clue = require('../src/Clue')

class DailyDouble extends Clue{
  constructor(clueInfo) {
    super(clueInfo)
    this.ddPointValue = 0;
  }

  takeWager(wager) {
    return this.ddPointValue = wager;
  }
}

module.exports = DailyDouble;