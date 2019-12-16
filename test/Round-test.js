import chai from 'chai';
const expect = chai.expect;
const Round = require('../src/round');

describe('Round', function() {
  let round = new Round;

  it('is a function', function() {
    expect(Round).to.be.a('function');
  });

  it('should be an instance of Round', function() {
    expect(round).to.be.an.instanceof(Round);
  });

  it('should initialize with an empty array of categories', function() {
    expect(round.categories).to.deep.equal([]);
  });

  it('should initialize with an empty array of clues', function() {
    expect(round.clues).to.deep.equal([]);
  });

  it('should initialize with a count of zero', function() {
    expect(round.count).to.deep.equal(0);
  });

  it('should be able to increase the count', function() {
    round.updateCount();
    expect(round.count).to.deep.equal(1);
  });
});
