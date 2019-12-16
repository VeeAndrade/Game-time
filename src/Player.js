const Game = require('../src/Game')
class Player {
  constructor(name) {
    this.name = name,
    this.turn = false,
    this.score = 0
  }

  // startGame(playersArr) {
  //   game = new Game(playersArr)
  //   return game;
  // }
}

module.exports = Player;