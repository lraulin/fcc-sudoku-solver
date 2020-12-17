const chai = require("chai");
const { expect } = chai;
const {
  validate,
  isValid,
  boardFromString,
  stringFromBoard,
  solve,
  check,
} = require("../controllers/sudoku-solver");

const Solver = require("../controllers/sudoku-solver.js");
let solver;

describe("UnitTests", () => {
  describe("#boardFromString", function () {
    it("Should turn string into 2D array", () => {
      const input =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const expected = [
        [1, 0, 5, 0, 0, 2, 0, 8, 4],
        [0, 0, 6, 3, 0, 1, 2, 0, 7],
        [0, 2, 0, 0, 5, 0, 0, 0, 0],
        [0, 9, 0, 0, 1, 0, 0, 0, 0],
        [8, 0, 2, 0, 3, 6, 7, 4, 0],
        [3, 0, 7, 0, 2, 0, 0, 9, 0],
        [4, 7, 0, 0, 0, 8, 0, 0, 1],
        [0, 0, 1, 6, 0, 0, 0, 0, 9],
        [2, 6, 9, 1, 4, 0, 3, 7, 0],
      ];
      expect(boardFromString(input)).to.eql(expected);
    });
  });

  describe("#stringFromBoard", function () {
    it("Should turn 3D array into string", () => {
      const input = [
        [1, 0, 5, 0, 0, 2, 0, 8, 4],
        [0, 0, 6, 3, 0, 1, 2, 0, 7],
        [0, 2, 0, 0, 5, 0, 0, 0, 0],
        [0, 9, 0, 0, 1, 0, 0, 0, 0],
        [8, 0, 2, 0, 3, 6, 7, 4, 0],
        [3, 0, 7, 0, 2, 0, 0, 9, 0],
        [4, 7, 0, 0, 0, 8, 0, 0, 1],
        [0, 0, 1, 6, 0, 0, 0, 0, 9],
        [2, 6, 9, 1, 4, 0, 3, 7, 0],
      ];
      const expected =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      expect(stringFromBoard(input)).to.equal(expected);
    });
  });

  describe("#visValid", function () {
    it("should return true when array contains digits 1-9", () => {
      const input = [1, 9, 7, 6, 8, 3, 4, 5, 2];
      expect(isValid(input)).to.be.true;
    });

    it("should return false when array does not contain exactly one each of digits 1-9", () => {
      const input = [7, 7, 3, 1, 9, 2, 4, 6, 8];
      expect(isValid(input)).to.be.false;
    });
  });

  describe("#validate", function () {
    it("should return true when given correctly solved Sudoku string", () => {
      const solvedString =
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
      expect(validate(solvedString)).to.be.true;
    });

    it("should return false when given an unsolved Sudoku string", () => {
      const solvedString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      expect(validate(solvedString)).to.be.false;
    });
  });

  describe("#solve", () => {
    it("should return the correct solution when given a valid puzzle string of 81 characters", () => {
      const input =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const expected =
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
      expect(solve(input)).to.equal(expected);
    });
  });

  it("should return null if the puzzle is unsolvable", () => {
    const input =
      "..9..5.1.85.4....2432.9.6..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    expect(solve(input)).to.be.null;
  });

  describe("#check", () => {
    it("should return true when given valid value", () => {
      const puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      expect(check(puzzle, "A2", 3)).to.be.true;
    });
  });

  it("should return false when given invalid value", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    expect(check(puzzle, "A2", 5)).to.be.false;
  });
});
