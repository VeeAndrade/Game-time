import chai from 'chai';
const expect = chai.expect;
const Clue = require('../src/clue');

describe('Clue', function () {
  let clue = new Clue();


    it('is a function', function () {
        expect(Clue).to.be.a('function');
    });

    it('should be an instance of Clue', function () {
        expect(clue).to.be.an.instanceof(Clue);
    });

});
