class Game {
  constructor(players) {
    this.players = players;
    this.roundCount = 0;
  }

  updateRound() {
    this.roundCount++;
  }

  determineWinner() {
    let sortedScores = this.players.slice().sort(function(a, b) { return  b.score - a.score})
    return sortedScores[0];
  }
}

export default Game;
