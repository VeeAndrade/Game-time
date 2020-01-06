const Clue = require('../src/Clue')

class DailyDouble extends Clue{
  constructor(clueInfo) {
    super(clueInfo)
    this.ddPointValue = 0;
  }

  determineWager(turns, player) {
    console.log('1111111111', player.score)
    console.log(turns)
    if (turns > 16) {
      this.pointValue = this.pointValue * 2;
    }
    
  }

  takeWager(wager) {
    return this.ddPointValue = wager;
  }
}

module.exports = DailyDouble;