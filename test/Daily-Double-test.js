import chai from 'chai';
const expect = chai.expect;
const Clue = require('../src/Clue')
const DailyDouble = require('../src/Daily-Double')
let dailyDoubleClue;
let question;
let clue;

describe('DailyDouble', () => {
  
  beforeEach(() => {
    question = {
      question: "Scorecard Report\" & \"Peter Jacobsen Plugged In\" are seen on the sports channel devoted to this",
      pointValue: 100,
      answer: "golf",
      categoryId: 10
    }
    clue = new Clue(question)
    dailyDoubleClue = new DailyDouble(question)
   });

  it('should take a wager and change point value', () => {
    dailyDoubleClue.takeWager(300)
    expect(dailyDoubleClue.pointValue).to.equal(300)
  });

});