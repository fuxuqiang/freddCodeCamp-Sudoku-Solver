const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.isTrue(new Solver(puzzlesAndSolutions[0][0]).validate().validLong);
    });
    test('Logic handles a puzzle string with invalid characters', () => {
        assert.isFalse(new Solver(puzzlesAndSolutions[1][0].replace('.', 0)).validate().validCharacters);
    });
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.isFalse(new Solver('1').validate().validLong);
    });
    test('Logic handles a valid row placement', () => {
        const solver = new Solver(puzzlesAndSolutions[2][0]);
        assert.isTrue(solver.checkRowPlacement(0, 2));
    });
    test('Logic handles a invalid row placement', () => {
        const solver = new Solver(puzzlesAndSolutions[2][0]);
        assert.isFalse(solver.checkRowPlacement(0, 8));
    });
    test('Logic handles a valid column placement', () => {
        const solver = new Solver(puzzlesAndSolutions[2][0]);
        assert.isTrue(solver.checkColPlacement(1, 1));
    });
    test('Logic handles a invalid column placement', () => {
        const solver = new Solver(puzzlesAndSolutions[2][0]);
        assert.isFalse(solver.checkColPlacement(1, 5));
    });
    test('Logic handles a valid region placement', () => {
        const solver = new Solver(puzzlesAndSolutions[2][0]);
        assert.isTrue(solver.checkRegionPlacement(1, 2, 3));
    });
    test('Logic handles a invalid region placement', () => {
        const solver = new Solver(puzzlesAndSolutions[2][0]);
        assert.isFalse(solver.checkRegionPlacement(1, 2, 4));
    });
    test('Valid puzzle strings pass the solver', () => {
        assert.isTrue(new Solver(puzzlesAndSolutions[4][0]).solve());
    });
    test('Invalid puzzle strings fail the solver', () => {
        assert.isFalse(new Solver('67.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6').solve());
    });
    test('Solver returns the expected solution for an incomplete puzzle', () => {
        assert.equal(new Solver(puzzlesAndSolutions[3][0]).getSovled(), puzzlesAndSolutions[3][1]);
    });
});
