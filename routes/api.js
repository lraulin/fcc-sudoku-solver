"use strict";

const solver = require("../controllers/sudoku-solver.js");

const OK = 200;
const BAD_REQUEST = 400;

const validatePuzzle = (res, puzzle) => {
  if (!puzzle) {
    res.status(BAD_REQUEST).send({ error: "Required field missing" });
    return false;
  }
  if (puzzle.length !== 81) {
    res
      .status(BAD_REQUEST)
      .send({ error: "Expected puzzle to be 81 characters long" });
    return false;
  }
  if (!/^[1-9.]{81}$/.test(puzzle)) {
    res.status(BAD_REQUEST).send({ error: "Invalid characters in puzzle" });
    return false;
  }
  return true;
};

module.exports = function (app) {
  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    // validation
    const isValid = validatePuzzle(res, puzzle);
    if (!isValid) return;

    const valid = solver.check(puzzle, coordinate, value);
    res.send({ valid });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    // validation
    const isValid = validatePuzzle(res, puzzle);
    if (!isValid) return;

    const solution = solver.solve(puzzle);
    if (solution) {
      return res.status(OK).send({ solution });
    } else {
      return res.status(BAD_REQUEST).send({ error: "Puzzle cannot be solved" });
    }
  });
};
