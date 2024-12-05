'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  app.use((req, res, next) => {
    if (req.body.puzzle) {
      const solver = new SudokuSolver(req.body.puzzle);
      const { validCharacters, validLong } = solver.validate();
      if (!validCharacters) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }
      if (!validLong) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }
      req.solver = solver;
    }
    next();
  });

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate | !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      if (coordinate.length != 2 || !/^[A-I]$/.test(coordinate[0]) || !/^[1-9]$/.test(coordinate[1])) {
        return res.json({ error: 'Invalid coordinate'});
      }
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      const rowString = 'ABCDEFGHI';
      const row = rowString.indexOf(coordinate[0]);
      const col = coordinate[1] - 1;
      req.solver.puzzle[row][col] = '.';
      const rowValid = req.solver.checkRowPlacement(row, value);
      const colValid = req.solver.checkColPlacement(col, value);
      const regionValid = req.solver.checkRegionPlacement(row, col, value);
      let result = { valid: rowValid && colValid && regionValid };
      if (!result.valid) {
        result.conflict = [];
        rowValid || result.conflict.push('row');
        colValid || result.conflict.push('column');
        regionValid || result.conflict.push('region');
      }
      res.json(result);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      const solution = req.solver.getSovled();
      res.json(solution ? { solution } : { error: 'Puzzle cannot be solved' });
    });
};
