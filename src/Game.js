class Game {
  constructor(players) {
    this.players = players;
    this.roundCount = 0;
  }

  updateRound() {
    this.roundCount++;
  }

  postToLeaderBoard(winningPlayer) {
    return fetch('https://fe-apps.herokuapp.com/api/v1/gametime/leaderboard', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        appId: "1909RNCGVA",
        playerName: `${winningPlayer.name}`,
        playerScore: Number(`${winningPlayer.score}`)
      })
    })
  }

  determineWinner() {
    let winnerArray = this.players.sort((a, b) => b.score - a.score);
    let winner = winnerArray[0];
    this.postToLeaderBoard(winner)
    return winner;
  }
}

module.exports = Game;
