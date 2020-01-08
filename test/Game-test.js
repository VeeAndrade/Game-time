import chai from 'chai';
const expect = chai.expect;
const Game = require('../src/Game');
const spies = require('chai-spies');
chai.use(spies)

describe('Game', function() {

  let players, game

  beforeEach(() => {
    players = [{name: 'Carla', score: 10},
      {name: 'Vee', score: 25},
      {name: 'Novak', score: 20}];
    game = new Game(players);
  })

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

  describe('fetchSpy', () => {

    let fetchSpy = chai.spy.on(global, 'fetch', () => {
      new Promise((resolve, reject) => resolve({message: console.log('resolve')}, 
      reject({message: console.log('rejected')})))
    })

    it('should be able to determine the winning player', function() {
      game.postToLeaderBoard(players[1])
      expect(fetchSpy).to.have.been.called(1)
    });
  })
});
