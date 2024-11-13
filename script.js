const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const modeSelector = document.getElementById("mode");
const difficultySelector = document.getElementById("difficulty");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let isBotMode = false;
let difficulty = "easy";

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

modeSelector.addEventListener("change", () => {
    isBotMode = modeSelector.value === "bot";
    restartGame();
});

difficultySelector.addEventListener("change", () => {
    difficulty = difficultySelector.value;
    restartGame();
});

function handleCellClick(e) {
    const cellIndex = e.target.getAttribute("data-index");
    if (board[cellIndex] !== "" || !gameActive || (isBotMode && currentPlayer === "O")) return;

    makeMove(cellIndex);
    if (gameActive && isBotMode && currentPlayer === "O") {
        setTimeout(botMove, 500); // Add 0.5-second delay before bot moves
    }
}

function makeMove(index) {
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a tie!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function botMove() {
    if (difficulty === "easy") {
        makeRandomMove();
    } else if (difficulty === "medium") {
        Math.random() < 0.5 ? makeRandomMove() : makeBestMove();
    } else {
        makeBestMove();
    }
}

function makeRandomMove() {
    const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(randomIndex);
}

function makeBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    makeMove(move);
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner("O")) return 10 - depth;
    if (checkWinner("X")) return depth - 10;
    if (board.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(player) {
    return winningConditions.some(condition => condition.every(index => board[index] === player));
}

function restartGame() {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.textContent = `Player X's turn`;
    cells.forEach(cell => (cell.textContent = ""));
}

// Event listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
