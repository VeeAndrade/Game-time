const Clue = require('../src/Clue')

class DailyDouble extends Clue{
  constructor(clueInfo) {
    super(clueInfo)
    this.ddPointValue = 0;
  }

  determineWager(turns, player, cluePoints) {
    let wagerLimit = 0;
    if (turns > 16) {
      this.pointValue = this.pointValue * 2;
    }
    if (player.score > cluePoints) {
      wagerLimit = player.score
    } else {
      wagerLimit = cluePoints;
    }
    return wagerLimit;
  }

  takeWager(wager) {
    return this.ddPointValue = wager;
  }
}

module.exports = DailyDouble;