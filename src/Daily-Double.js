const Clue = require('../src/Clue')

class DailyDouble extends Clue {
  constructor(clueInfo) {
    super(clueInfo)
    this.ddPointValue = 0;
  }

  determineWager(turns, player, cluePoints) {
    let wagerLimit = 0;
    this.ddPointValue = cluePoints;
    if (turns > 16) {
      this.ddPointValue = cluePoints * 2;
    }
    if (player.score > this.ddPointValue) {
      wagerLimit = player.score
    } else {
      wagerLimit = this.ddPointValue;
    }
    return wagerLimit;
  }

  takeWager(wager) {
    return this.ddPointValue = wager;
  }
}

module.exports = DailyDouble;
