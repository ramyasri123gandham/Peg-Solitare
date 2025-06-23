const boardElement = document.getElementById("board");
const gameOverDialog = document.getElementById("gameOverDialog");
const winDialog = document.getElementById("winDialog");

const howToPlayModal = document.getElementById("howToPlayModal");
const darkModeToggle = document.getElementById("darkModeToggle");
const fullscreenToggle = document.getElementById("fullscreenToggle");

let board = [];
let moveHistory = [];
let selected = null;
let moves = 0;

function isValid(i, j) {
  return i >= 0 && i < 7 && j >= 0 && j < 7 &&
         !((i < 2 || i > 4) && (j < 2 || j > 4));
}

function initBoard() {
  board = Array(7).fill(null).map(() => Array(7).fill(null));
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (isValid(i, j)) board[i][j] = 1;
    }
  }
  board[3][3] = 0;
  selected = null;
  moves = 0;
  moveHistory = [];
  updateMoveCounter();
  renderBoard();
}

function updateMoveCounter() {
  document.getElementById("moveCounter").innerText = `Moves: ${moves}`;
}

function renderBoard() {
  boardElement.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (!isValid(i, j)) {
        boardElement.appendChild(cell);
        continue;
      }
      if (board[i][j] === 1) {
        const peg = document.createElement("div");
        peg.className = "peg";
        peg.onclick = () => selectPeg(i, j);
        cell.appendChild(peg);
      } else if (selected && isMoveValid(selected, [i, j])) {
        const moveDot = document.createElement("div");
        moveDot.className = "valid-move";
        moveDot.onclick = () => movePeg(i, j);
        cell.appendChild(moveDot);
      }
      boardElement.appendChild(cell);
    }
  }
}

function selectPeg(i, j) {
  selected = [i, j];
  renderBoard();
}

function isMoveValid(from, to) {
  const [i, j] = from;
  const [x, y] = to;
  const mid = [(i + x) / 2, (j + y) / 2];
  if (Math.abs(i - x) === 2 && j === y || Math.abs(j - y) === 2 && i === x) {
    if (board[x][y] === 0 && board[mid[0]][mid[1]] === 1) return true;
  }
  return false;
}

function movePeg(i, j) {
  const [x, y] = selected;
  const [mi, mj] = [(x + i) / 2, (y + j) / 2];
  moveHistory.push(JSON.parse(JSON.stringify(board)));
  board[x][y] = 0;
  board[mi][mj] = 0;
  board[i][j] = 1;
  selected = null;
  moves++;
  updateMoveCounter();
  renderBoard();
  checkGameOver();
}

function undoMove() {
  if (moveHistory.length) {
    board = moveHistory.pop();
    moves--;
    updateMoveCounter();
    renderBoard();
  }
}

function resetGame() {
  gameOverDialog.style.display = "none";
  winDialog.style.display = "none";
  initBoard();
}

function checkGameOver() {
  let pegs = 0;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (board[i][j] === 1) {
        pegs++;
        for (let d of [[2,0], [-2,0], [0,2], [0,-2]]) {
          const ni = i + d[0], nj = j + d[1];
          const mi = i + d[0]/2, mj = j + d[1]/2;
          if (isValid(ni,nj) && board[ni][nj] === 0 && board[mi][mj] === 1)
            return;
        }
      }
    }
  }
  if (pegs === 1) winDialog.style.display = "flex";
  else gameOverDialog.style.display = "flex";
}

function closeHowToPlay() {
  howToPlayModal.style.display = "none";
}

// Events
document.getElementById("howToPlayBtn").onclick = () => {
  howToPlayModal.style.display = "flex";
};

darkModeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

fullscreenToggle.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// Start game
initBoard();
