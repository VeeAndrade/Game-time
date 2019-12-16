class Clue {
    constructor(clue) {
        this.question = clue.question;
        this.pointValue = clue.pointValue;
        this.answer= clue.answer;
        this.categoryId = clue.categoryId;
        this.dailyDouble = false;
        this.alreadySelected = false;
    }

    activateDailyDouble() {
        this.dailyDouble = true;
    }

    selectCard() {
        this.alreadySelected = true;
    }

}

module.exports = Clue;