const ROWS = 6;
const COLUMNS = 7;

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const playerOneCard = document.getElementById("player-one-card");
const playerTwoCard = document.getElementById("player-two-card");
const playerOneScore = document.getElementById("player-one-score");
const playerTwoScore = document.getElementById("player-two-score");
const newGameButton = document.getElementById("new-game");
const result = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const playAgainButton = document.getElementById("play-again");

let board = [];
let currentPlayer = 1;
let gameOver = false;
let scores = { playerOne: 0, playerTwo: 0 };

function createBoard() {
  boardElement.innerHTML = "";
  board = [];

  for (let row = 0; row < ROWS; row++) {
    board.push([0, 0, 0, 0, 0, 0, 0]);

    for (let column = 0; column < COLUMNS; column++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.column = column;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", column + 1 + "-р багана");
      cell.addEventListener("click", function () {
        playColumn(column);
      });
      boardElement.appendChild(cell);
    }
  }
}

function startGame() {
  currentPlayer = 1;
  gameOver = false;
  result.hidden = true;
  boardElement.classList.remove("locked");
  createBoard();
  updateScreen();
}

function playColumn(column) {
  if (gameOver) return;

  const row = findEmptyRow(column);

  if (row === -1) {
    statusElement.textContent = "Энэ багана дүүрсэн байна.";
    return;
  }

  board[row][column] = currentPlayer;

  const cell = getCell(row, column);
  cell.classList.add(currentPlayer === 1 ? "red" : "yellow");
  cell.setAttribute(
    "aria-label",
    column + 1 + "-р багана, Тоглогч " + currentPlayer + "-ийн чулуу",
  );

  const winningCells = checkWinner(currentPlayer);

  if (winningCells) {
    finishGame(currentPlayer, winningCells);
    return;
  }

  if (isBoardFull()) {
    finishGame(0, []);
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateScreen();
}

function findEmptyRow(column) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][column] === 0) return row;
  }
  return -1;
}

function checkWinner(player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      if (board[row][column] !== player) continue;

      for (const direction of directions) {
        const winningCells = [];

        for (let count = 0; count < 4; count++) {
          const nextRow = row + direction[0] * count;
          const nextColumn = column + direction[1] * count;

          if (
            nextRow < 0 ||
            nextRow >= ROWS ||
            nextColumn < 0 ||
            nextColumn >= COLUMNS ||
            board[nextRow][nextColumn] !== player
          ) {
            break;
          }

          winningCells.push([nextRow, nextColumn]);
        }

        if (winningCells.length === 4) return winningCells;
      }
    }
  }

  return null;
}

function finishGame(winner, winningCells) {
  gameOver = true;
  boardElement.classList.add("locked");

  for (const position of winningCells) {
    getCell(position[0], position[1]).classList.add("win");
  }

  if (winner === 1) {
    scores.playerOne++;
    resultTitle.textContent = "Тоглогч 1 хожлоо!";
  } else if (winner === 2) {
    scores.playerTwo++;
    resultTitle.textContent = "Тоглогч 2 хожлоо!";
  } else {
    resultTitle.textContent = "Тэнцлээ!";
  }

  updateScore();
  statusElement.textContent = resultTitle.textContent;
  result.hidden = false;
  playAgainButton.focus();
}

function updateScreen() {
  playerOneCard.classList.toggle("active", currentPlayer === 1);
  playerTwoCard.classList.toggle("active", currentPlayer === 2);
  statusElement.textContent = "Тоглогч " + currentPlayer + "-ийн ээлж";
}

function updateScore() {
  playerOneScore.textContent = scores.playerOne;
  playerTwoScore.textContent = scores.playerTwo;
}

function isBoardFull() {
  return board[0].every(function (cell) {
    return cell !== 0;
  });
}

function getCell(row, column) {
  return boardElement.querySelector(
    '[data-row="' + row + '"][data-column="' + column + '"]',
  );
}

newGameButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);

document.addEventListener("keydown", function (event) {
  if (!result.hidden && event.key === "Escape") {
    startGame();
    return;
  }

  const column = Number(event.key) - 1;
  if (column >= 0 && column < COLUMNS) playColumn(column);
});

startGame();
