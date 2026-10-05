const ROWS = 6;
const COLUMNS = 7;
const PLAYER = 1;
const COMPUTER = 2;

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");
const playerCard = document.querySelector(".player-card.human");
const computerCard = document.querySelector(".player-card.computer");
const playerTurnLabel = document.getElementById("player-turn");
const computerTurnLabel = document.getElementById("computer-turn");
const resetButton = document.getElementById("reset-game");
const resultDialog = document.getElementById("result-dialog");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultToken = document.getElementById("result-token");
const playAgainButton = document.getElementById("play-again");

let board = [];
let currentPlayer = PLAYER;
let gameOver = false;
let computerTimer = null;
let resultTimer = null;
let scores = loadScores();

function loadScores() {
  try {
    const saved = JSON.parse(localStorage.getItem("connectFourScores"));
    return {
      player: Number(saved?.player) || 0,
      computer: Number(saved?.computer) || 0,
    };
  } catch {
    return { player: 0, computer: 0 };
  }
}

function saveScores() {
  try {
    localStorage.setItem("connectFourScores", JSON.stringify(scores));
  } catch {
    // The game remains playable when browser storage is unavailable.
  }
}

function createBoard() {
  boardElement.replaceChildren();
  board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.column = column;
      cell.dataset.playable = row === ROWS - 1 ? "true" : "false";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `${column + 1}-р багана`);
      cell.addEventListener("click", () => playColumn(column));
      boardElement.append(cell);
    }
  }
}

function startGame() {
  window.clearTimeout(computerTimer);
  window.clearTimeout(resultTimer);
  currentPlayer = PLAYER;
  gameOver = false;
  resultDialog.hidden = true;
  createBoard();
  updateScoreboard();
  updateTurnUI();
}

function playColumn(column) {
  if (gameOver || currentPlayer !== PLAYER) return;
  makeMove(column, PLAYER);
}

function makeMove(column, player) {
  const row = findOpenRow(board, column);
  if (row === -1) {
    if (player === PLAYER) statusElement.textContent = "Энэ багана дүүрсэн байна.";
    return false;
  }

  board[row][column] = player;
  renderMove(row, column, player);

  const winningCells = getWinningCells(board, player);
  if (winningCells) {
    finishGame(player, winningCells);
    return true;
  }

  if (board.every((line) => line.every(Boolean))) {
    finishGame(0, []);
    return true;
  }

  currentPlayer = player === PLAYER ? COMPUTER : PLAYER;
  updateTurnUI();

  if (currentPlayer === COMPUTER) {
    computerTimer = window.setTimeout(computerMove, 650);
  }

  return true;
}

function findOpenRow(targetBoard, column) {
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (targetBoard[row][column] === 0) return row;
  }
  return -1;
}

function renderMove(row, column, player) {
  const cell = getCell(row, column);
  cell.classList.add(player === PLAYER ? "red" : "yellow", "drop");
  cell.setAttribute(
    "aria-label",
    `${column + 1}-р багана, ${player === PLAYER ? "улаан" : "шар"} чулуу`,
  );

  document.querySelectorAll(`.cell[data-column="${column}"]`).forEach((item) => {
    item.dataset.playable = "false";
  });

  const nextRow = findOpenRow(board, column);
  if (nextRow >= 0) getCell(nextRow, column).dataset.playable = "true";
}

function computerMove() {
  if (gameOver) return;
  const column = chooseComputerColumn();
  makeMove(column, COMPUTER);
}

function chooseComputerColumn() {
  const validColumns = Array.from({ length: COLUMNS }, (_, index) => index).filter(
    (column) => findOpenRow(board, column) !== -1,
  );

  for (const player of [COMPUTER, PLAYER]) {
    for (const column of validColumns) {
      const copy = board.map((row) => [...row]);
      copy[findOpenRow(copy, column)][column] = player;
      if (getWinningCells(copy, player)) return column;
    }
  }

  const scored = validColumns.map((column) => ({
    column,
    score: scoreComputerMove(column) + Math.random(),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].column;
}

function scoreComputerMove(column) {
  const row = findOpenRow(board, column);
  let score = 7 - Math.abs(3 - column) * 1.7;
  const copy = board.map((line) => [...line]);
  copy[row][column] = COMPUTER;

  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [rowStep, columnStep] of directions) {
    let connected = 1;
    for (const sign of [-1, 1]) {
      let nextRow = row + rowStep * sign;
      let nextColumn = column + columnStep * sign;
      while (
        nextRow >= 0 &&
        nextRow < ROWS &&
        nextColumn >= 0 &&
        nextColumn < COLUMNS &&
        copy[nextRow][nextColumn] === COMPUTER
      ) {
        connected += 1;
        nextRow += rowStep * sign;
        nextColumn += columnStep * sign;
      }
    }
    score += connected * connected;
  }

  return score;
}

function getWinningCells(targetBoard, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      if (targetBoard[row][column] !== player) continue;

      for (const [rowStep, columnStep] of directions) {
        const cells = [];
        for (let index = 0; index < 4; index += 1) {
          const nextRow = row + rowStep * index;
          const nextColumn = column + columnStep * index;
          if (
            nextRow < 0 ||
            nextRow >= ROWS ||
            nextColumn < 0 ||
            nextColumn >= COLUMNS ||
            targetBoard[nextRow][nextColumn] !== player
          ) {
            break;
          }
          cells.push([nextRow, nextColumn]);
        }
        if (cells.length === 4) return cells;
      }
    }
  }
  return null;
}

function finishGame(winner, winningCells) {
  gameOver = true;
  boardElement.classList.add("locked");
  winningCells.forEach(([row, column]) => getCell(row, column).classList.add("win"));

  if (winner === PLAYER) {
    scores.player += 1;
    statusElement.textContent = "Та хожлоо!";
    resultTitle.textContent = "Та хожлоо!";
    resultMessage.textContent = "Дөрвөн улаан чулуугаа амжилттай холболоо.";
    resultToken.className = "result-token token token-red";
  } else if (winner === COMPUTER) {
    scores.computer += 1;
    statusElement.textContent = "Компьютер хожлоо.";
    resultTitle.textContent = "Компьютер хожлоо";
    resultMessage.textContent = "Дахин оролдоод ялалтаа аваарай.";
    resultToken.className = "result-token token token-yellow";
  } else {
    statusElement.textContent = "Тэнцлээ!";
    resultTitle.textContent = "Тэнцлээ!";
    resultMessage.textContent = "Самбар дүүрлээ. Дахин нэг тоглох уу?";
    resultToken.className = "result-token token";
  }

  saveScores();
  updateScoreboard();
  updateTurnUI();
  resultTimer = window.setTimeout(openResultDialog, 900);
}

function openResultDialog() {
  resultDialog.hidden = false;
  playAgainButton.focus();
}

function updateScoreboard() {
  playerScoreElement.textContent = scores.player;
  computerScoreElement.textContent = scores.computer;
}

function updateTurnUI() {
  const isPlayerTurn = currentPlayer === PLAYER && !gameOver;
  playerCard.classList.toggle("active", isPlayerTurn);
  computerCard.classList.toggle("active", currentPlayer === COMPUTER && !gameOver);
  boardElement.classList.toggle("locked", !isPlayerTurn);

  playerTurnLabel.textContent = isPlayerTurn ? "Таны ээлж" : "Хүлээж байна";
  computerTurnLabel.textContent =
    currentPlayer === COMPUTER && !gameOver ? "Бодож байна..." : "Хүлээж байна";

  if (!gameOver) {
    statusElement.textContent = isPlayerTurn
      ? "Баганаа сонгоод чулуугаа хийнэ үү"
      : "Компьютер нүүдлээ бодож байна...";
  }
}

function getCell(row, column) {
  return boardElement.querySelector(`[data-row="${row}"][data-column="${column}"]`);
}

resetButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  if (!resultDialog.hidden) {
    if (event.key === "Escape") startGame();
    if (event.key === "Tab") {
      event.preventDefault();
      playAgainButton.focus();
    }
    return;
  }

  const column = Number(event.key) - 1;
  if (column >= 0 && column < COLUMNS) playColumn(column);
  if (event.key.toLowerCase() === "r") startGame();
});

startGame();
