import chai from 'chai';
const expect = chai.expect;
const Clue = require('../src/Clue')
const Player = require('../src/Player')

describe('Clue', function () {
    
    let clue;
    let question;

    beforeEach(() => {
        question = {question: "Scorecard Report\" & \"Peter Jacobsen Plugged In\" are seen on the sports channel devoted to this",
        pointValue: 100,
        answer: "golf",
        categoryId: 10}
        clue = new Clue(question);
    });


    it('is a function', function () {
        expect(Clue).to.be.a('function');
    });

    it('should be an instance of Clue', function () {
        expect(clue).to.be.an.instanceof(Clue);
    });

    it('should have a question, point value, correct answer, and category ID', function () {
        expect(clue.question).to.equal("Scorecard Report\" & \"Peter Jacobsen Plugged In\" are seen on the sports channel devoted to this");
        expect(clue.pointValue).to.equal(100);
        expect(clue.answer).to.equal("golf");
        expect(clue.categoryId).to.equal(10);
    });

    it('should toggle its already selectd value once checkAnswer is envoked', function() {
        clue.selectCard();

        expect(clue.alreadySelected).to.equal(true);
    });

    it('should evaluate a correct answer', function() {
        let guess = 'golf'
        let player = new Player()
        clue.checkAnswer(player, guess);

        expect(player.score).to.equal(100);
    });

    it('should evaluate an incorrect answer', function () {
        let guess = 'football'
        let player = new Player()
        clue.checkAnswer(player, guess);

        expect(player.score).to.equal(-100);
    });


    // unsure if we will use the following functionality reading that it's the final round of the game
//     it('should be the final clue if it is round 3', function() {

//     })
});
