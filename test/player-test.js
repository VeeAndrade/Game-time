import chai from 'chai';
const expect = chai.expect;

const Player = require('../src/Player')
const Game = require('../src/Game')

describe('Player', () => {
  let player1, player2, player3;
  let game

  beforeEach(() => {
    player1 = new Player('Carla')
    player2 = new Player('Vee')
    player3 = new Player('Novak')
    game = new Game([player1, player2, player3])
  });

  it('should be an instance of a player', () => {
    expect(player1).to.be.an.instanceOf(Player)
  });

  it('should have a name', () => {
    expect(player1.name).to.equal('Carla')
  });

  it('should know whether it\'s their turn or not', () => {
    expect(player1.turn).to.equal(false)
  });

  it('should have a starting score of 0', () => {
    expect(player1.score).to.equal(0)
  });

  // it('should be able to start a new game', () => {
  //   expect(player1.startGame([player1, player2, player3])).to.equal(game)
  // });
});