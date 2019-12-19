const Clue = require('../src/Clue')

class DailyDouble extends Clue{
  constructor(clueInfo) {
    super(clueInfo)
  }

  takeWager(wager) {
    return this.pointValue = wager;
  }
}

module.exports = DailyDouble;