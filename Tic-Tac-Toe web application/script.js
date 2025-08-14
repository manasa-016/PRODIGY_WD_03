const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const winnerEl = document.getElementById("winner");
const newGameBtn = document.getElementById("newGame");
const modeSelection = document.getElementById("modeSelection");
const gameArea = document.getElementById("gameArea");

let board = Array(9).fill("");
let xTurn = true;
let gameOver = false;
let gameMode = "twoPlayer"; // default

const WIN_COMBINATIONS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function startGame(mode) {
  gameMode = mode;
  modeSelection.classList.add("hidden");
  gameArea.classList.remove("hidden");
  resetGame();
}

function createBoard() {
  boardEl.innerHTML = "";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => makeMove(i));
    boardEl.appendChild(cell);
  });
}

function makeMove(i) {
  if (board[i] !== "" || gameOver) return;
  
  board[i] = xTurn ? "X" : "O";
  updateBoard();

  let winner = checkWinner();
  if (winner) {
    endGame(winner);
    return;
  }

  xTurn = !xTurn;
  statusEl.textContent = `Turn: ${xTurn ? "X" : "O"}`;

  if (gameMode === "computer" && !xTurn && !gameOver) {
    setTimeout(computerMove, 500); // small delay for realism
  }
}

function computerMove() {
  let available = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
  let move = available[Math.floor(Math.random() * available.length)];
  board[move] = "O";
  updateBoard();

  let winner = checkWinner();
  if (winner) {
    endGame(winner);
    return;
  }

  xTurn = !xTurn;
  statusEl.textContent = `Turn: ${xTurn ? "X" : "O"}`;
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i];
  });
}

function checkWinner() {
  for (let combo of WIN_COMBINATIONS) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWinner(combo);
      return board[a];
    }
  }
  if (!board.includes("")) return "Draw";
  return null;
}

function highlightWinner(combo) {
  combo.forEach(i => {
    document.querySelectorAll(".cell")[i].classList.add("win");
  });
}

function endGame(winner) {
  gameOver = true;
  winnerEl.classList.remove("hidden");
  winnerEl.textContent = winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`;
}

function resetGame() {
  board = Array(9).fill("");
  xTurn = true;
  gameOver = false;
  winnerEl.classList.add("hidden");
  statusEl.textContent = "Turn: X";
  createBoard();
}

newGameBtn.addEventListener("click", resetGame);

createBoard();
