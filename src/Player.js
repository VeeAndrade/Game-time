const Game = require('../src/Game')
class Player {
  constructor(name) {
    this.name = name,
    this.turn = false,
    this.score = 0
    this.wager;
    this.finalGuess;
  }

  increaseScore(pointValue) {
    return this.score = this.score + pointValue;
  }

  decreaseScore(pointValue) {
    return this.score = this.score - pointValue;
  }

  takeTurn() {
    this.turn = !this.turn;
  }

  // startGame(playersArr) {
  //   game = new Game(playersArr)
  //   return game;
  // }
}

module.exports = Player;
