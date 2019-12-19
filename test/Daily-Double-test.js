import chai from 'chai';
const expect = chai.expect;
const DailyDouble = require('../src/Daily-Double')
let dailyDoubleClue;
let question;

describe('DailyDouble', () => {
  
  beforeEach(() => {
    question = {
      question: "Scorecard Report\" & \"Peter Jacobsen Plugged In\" are seen on the sports channel devoted to this",
      pointValue: 100,
      answer: "golf",
      categoryId: 10
    }
    // clue = new Clue(question)
    dailyDoubleClue = new DailyDouble(question)
   });
  
   it('should have a wager of 0', () => {
    expect(dailyDoubleClue.wager).to.equal(0)
  });
});