import chai from 'chai';
const expect = chai.expect;
const Clue = require('../src/clue');

describe('Clue', function () {
    let question = {question: "Scorecard Report\" & \"Peter Jacobsen Plugged In\" are seen on the sports channel devoted to this",
    pointValue: 100,
    answer: "golf",
    categoryId: 10}
    let clue = new Clue(question);


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

    it('should have Daily Double and already selected default to false', function () {
        expect(clue.dailyDouble).to.equal(false);
        expect(clue.alreadySelected).to.equal(false);
    });

    it('should be able to be a Daily Double clue', function() {
        clue.activateDailyDouble();

        expect(clue.dailyDouble).to.equal(true);
    });

    it('should toggle its already selectd value once selected', function() {
        clue.selectCard();

        expect(clue.alreadySelected).to.equal(true);
    })

});
