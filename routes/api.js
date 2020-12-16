"use strict";

const solver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    const valid = solver.check(puzzle, coordinate, value);
    res.send({ valid });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    const solution = solver.solve(puzzle);
    res.send({ solution });
  });
};
