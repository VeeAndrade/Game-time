class Clue {
  constructor(clueInfo) {
    this.question = clueInfo.question;
    this.pointValue = clueInfo.pointValue;
    this.answer = clueInfo.answer;
    this.categoryId = clueInfo.categoryId;
    this.id = clueInfo.id;
    this.alreadySelected = false;
    this.finalClue = false;
  }

  activateDailyDouble() {
    this.dailyDouble = true;
    return this.pointValue = this.pointValue * 2;
  }

  selectCard() {
    this.alreadySelected = true;
  }

  checkAnswer(player, guess) {
    if (guess === this.answer) {
      player.increaseScore(this.pointValue)
    } else {
      player.decreaseScore(this.pointValue)
    }
  }
}

module.exports = Clue;
