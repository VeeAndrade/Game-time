class Game {
  constructor(players) {
    this.players = players;
    this.roundCount = 0;
  }

  determineWinner() {
    this.players.sort(function(a, b){return b.score - a.score}))
    return this.players[0];
  }

  updateRound() {
    this.roundCount++;
  }
}

module.exports = Game;
