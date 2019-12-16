import chai from 'chai';
const expect = chai.expect;

describe('Player', () => {
  let player;
  
  beforeEach(() => {
    player = new Player('Billy')
  });

  it('should be an instance of a player', () => {
    expect(player).to.be.an.instanceOf(Player)
  });

  it('should have a name', () => {
    expect(player.name).to.equal('Billy')
  });

  it('should know whether it\'s their turn or not', () => {
    expect(player.turn).to.equal(false)
  });
   
  it('should have a starting score of 0', () => {
    expect(player.score).to.equal(0)
  });

});