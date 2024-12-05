class SudokuSolver {

  constructor(puzzleString) {
    this.length = 9;
    this.puzzleString = puzzleString;
    this.puzzle = Array.from(
      { length: this.length },
      (_, i) => Array.from(puzzleString.substr(i * this.length, this.length))
    );
  }

  validate() {
    return {
      validCharacters: /^[1-9.]+$/.test(this.puzzleString),
      validLong: this.puzzleString.length == 81
    }
  }

  checkRowPlacement(row, value) {
    for (let i = 0; i < this.length; i++) {
      if (this.puzzle[row][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(column, value) {
    for (let i = 0; i < this.length; i++) {
      if (this.puzzle[i][column] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(row, column, value) {
    for (let i = 0; i < this.length; i++) {
      if (this.puzzle[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(column / 3) + i % 3] == value) {
        return false;
      }
    }
    return true;
  }

  solve() {
    for (let row = 0; row < this.length; row++) {
      for (let column = 0; column < this.length; column++) {
        if (this.puzzle[row][column] == '.') {
          for (let value = 1; value <= this.length; value++) {
            if (
              this.checkRowPlacement(row, value)
              && this.checkColPlacement(column, value)
              && this.checkRegionPlacement(row, column, value)
            ) {
              this.puzzle[row][column] = value;
              if (this.solve()) {
                return true;
              }
              this.puzzle[row][column] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  getSovled() {
    if (this.solve()) {
      return this.puzzle.map(row => row.join('')).join('');
    }
    return false;
  }
}

module.exports = SudokuSolver;

