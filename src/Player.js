const Game = require('../src/Game')
class Player {
  constructor(name) {
    this.name = name,
    this.turn = false,
    this.score = 0
    this.wager = 0;
    this.finalGuess;
  }

  increaseScore(pointValue) {
    return this.score += Number(pointValue);
  }

  decreaseScore(pointValue) {
    return this.score -= Number(pointValue);
  }

  takeTurn() {
    this.turn = !this.turn;
  }

}

module.exports = Player;
