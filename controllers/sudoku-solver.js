const boardFromString = (puzzleString = "") => {
  const grid = [...Array(9)].map((e) => Array(9));
  let row = 0;
  let col = 0;
  puzzleString.split("").forEach((element) => {
    grid[row][col] = Number.parseInt(element) ? Number.parseInt(element) : 0;

    col++;
    if (col >= 9) {
      col = 0;
      row++;
    }
  });
  return grid;
};

const stringFromBoard = (board = [[]]) =>
  board
    .map((row) => row.join(""))
    .join("")
    .replace(/0/g, ".");

const getRow = (board = [[0]], row = 0) => board[row];

const getColumn = (board = [[0]], column = 0) =>
  [...Array(board.length).keys()].map((row) => board[row][column]);

const getSquare = (board = [[0]], squareNumber = 0) => {
  const square = [...Array(3)].map((e) => Array(3));

  let rowOffset;
  let columnOffset;

  switch (squareNumber) {
    case 0:
      rowOffset = 0;
      columnOffset = 0;
      break;
    case 1:
      rowOffset = 0;
      columnOffset = 3;
      break;
    case 2:
      rowOffset = 0;
      columnOffset = 6;
      break;
    case 3:
      rowOffset = 3;
      columnOffset = 0;
      break;
    case 4:
      rowOffset = 3;
      columnOffset = 3;
      break;
    case 5:
      rowOffset = 3;
      columnOffset = 6;
      break;
    case 6:
      rowOffset = 6;
      columnOffset = 0;
      break;
    case 7:
      rowOffset = 6;
      columnOffset = 3;
      break;
    case 8:
      rowOffset = 6;
      columnOffset = 6;
      break;
    default:
      throw new Error("Source must be a number from 1 to 9");
  }

  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      square[i][j] = board[i + rowOffset][j + columnOffset];
    }
  }
  return square;
};

const _numberSorter = (a, b) => a - b;

const _isValid = (arr = []) =>
  arr.flat().sort(_numberSorter).join("") === "123456789";

const validate = (puzzleString = "") => {
  // can't be valid if not completed
  if (puzzleString.includes(".")) return false;

  const board = boardFromString(puzzleString);
  // check each row, column, and square
  for (let i = 0; i < 9; i++) {
    // Check row
    const row = getRow(board, i);
    if (!_isValid(row)) {
      // console.log(`Rejected at row ${i} (zero-indexed): ${row}`);
      // console.log(row.sort(numberSorter));
      return false;
    }
    const column = getColumn(board, i);
    // console.log(`Rejected at column ${i} (zero-indexed): ${column}`);
    // console.log(column.sort(numberSorter));
    if (!_isValid(column)) {
      return false;
    }
    const square = getSquare(board, i);
    if (!_isValid(square.flat())) {
      // console.log(`Rejected at square ${i} (zero-indexed): ${square}`);
      // console.log(square.sort(numberSorter));
      return false;
    }
  }
  return true;
};

function nextEmptySpot(board) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] === 0) return [i, j];
    }
  }
  return [-1, -1];
}

function checkRow(board, row, value) {
  for (var i = 0; i < board[row].length; i++) {
    if (board[row][i] === value) {
      return false;
    }
  }

  return true;
}

function checkColumn(board, column, value) {
  for (var i = 0; i < board.length; i++) {
    if (board[i][column] === value) {
      return false;
    }
  }

  return true;
}

function checkSquare(board, row, column, value) {
  let boxRow = Math.floor(row / 3) * 3;
  let boxCol = Math.floor(column / 3) * 3;

  for (var r = 0; r < 3; r++) {
    for (var c = 0; c < 3; c++) {
      if (board[boxRow + r][boxCol + c] === value) return false;
    }
  }

  return true;
}

function checkValue(board, row, column, value) {
  if (
    checkRow(board, row, value) &&
    checkColumn(board, column, value) &&
    checkSquare(board, row, column, value)
  ) {
    return true;
  }

  return false;
}

function solveBoard(board) {
  let emptySpot = nextEmptySpot(board);
  let row = emptySpot[0];
  let col = emptySpot[1];

  // there is no more empty spots
  if (row === -1) {
    return board;
  }

  for (let num = 1; num <= 9; num++) {
    if (checkValue(board, row, col, num)) {
      board[row][col] = num;
      solveBoard(board);
    }
  }

  if (nextEmptySpot(board)[0] !== -1) board[row][col] = 0;

  return board;
}

const solve = (puzzleString = "") => {
  const board = boardFromString(puzzleString);
  const solution = solveBoard(board);
  const solutionString = stringFromBoard(solution);
  return solutionString.includes(".") ? null : solutionString;
};

const check = (puzzle = "", coordinate = "", value = 0) => {
  const board = boardFromString(puzzle);
  const CAPITAL_A_CHAR_CODE = 65;
  const row = coordinate.charCodeAt(0) - CAPITAL_A_CHAR_CODE;
  const col = Number.parseInt(coordinate.charAt(1)) - 1;
  board[row][col] = value;
  const solutionString = stringFromBoard(solveBoard(board));
  const isSolvable = !solutionString.includes(".");
  return isSolvable;
};

module.exports = {
  boardFromString,
  stringFromBoard,
  isValid: _isValid,
  validate,
  check,
  solve,
};
