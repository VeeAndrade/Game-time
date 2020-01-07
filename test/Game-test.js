import chai from 'chai';
const expect = chai.expect;
const Game = require('../src/Game');

describe('Game', function() {
  let players = [{name: 'Carla', score: 10},
    {name: 'Vee', score: 25},
    {name: 'Novak', score: 20}];
  let game = new Game(players);

  it('is a function', function() {
    expect(Game).to.be.a('function');
  });

  it('should be an instance of Game', function() {
    expect(game).to.be.an.instanceof(Game);
  });

  it('should initialize with an array of players', function() {
    expect(game.players).to.deep.equal(players);
  });

  it('should initialize with a round count of 0', function() {
    expect(game.roundCount).to.equal(0);
  });

  it('should be able to update the round count', function() {
    game.updateRound();
    expect(game.roundCount).to.equal(1);
  });

  it('should be able to determine the winning player', function() {
    expect(game.determineWinner()).to.equal(players[1]);
  });
});
