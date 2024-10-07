const dictionary = ["earth", "plane", "crane", "audio", "house"];

const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
  orientation: "row",
};

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = "") {
  const box = document.createElement("div");
  box.className = "box";
  box.id = `box${row}${col}`;
  box.textContent = letter;

  container.appendChild(box);
  return box;
}

function drawGrid(container) {
  const grid = document.createElement("div");
  grid.className = "grid";

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === "Enter") {
      if (state.currentCol === 5) {
        const word = getCurrentWord(state.orientation);
        revealWord(word);
        state.currentRow++;
        state.currentCol = 0;
      }
    }
    if (key === "Backspace") {
      removeLetter();
    }
    if (e.code === "Space") {
      changeOrientation();
    }
    if (isLetter(key)) {
      addLetter(key);
    }
    if (isArrow(key)) {
      changeRowColKey(key);
    }

    updateGrid();
  };
}

function registerClickEvents() {
  document.body.onclick = (e) => {
    if ((e.target.id && !e.target.id.includes("box")) || !e.target.id) return;
    const prevRow = state.currentRow;
    const prevCol = state.currentCol;

    const newRow = e.target.id.slice(-2)[0];
    const newCol = e.target.id.slice(-2)[1];

    changeRowColClick(prevRow, prevCol, newRow, newCol);
  };

  document.body.ondblclick = (e) => {
    changeOrientation();
  };
}

function changeOrientation() {
  state.orientation === "row"
    ? (state.orientation = "col")
    : (state.orientation = "row");

  changeGroupSelected(state.orientation, state.currentRow, state.currentCol);
}

function changeGroupSelected(orientation, currentRow, currentCol) {
  const prevGroupSelected = document.getElementsByClassName("groupselect");

  if (prevGroupSelected) {
    Array.from(prevGroupSelected).forEach((elem) =>
      elem.classList.remove("groupselect")
    );
  }
  if (orientation === "row") {
    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`box${currentRow}${i}`);
      box.classList.add("groupselect");
    }
  }
  if (orientation === "col") {
    for (let i = 0; i < 6; i++) {
      const box = document.getElementById(`box${i}${currentCol}`);
      box.classList.add("groupselect");
    }
  }
}

function getCurrentWord(orientation) {
  let word = "";

  if (orientation === "row") {
    word = state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
  }
  if (orientation === "col") {
    word = state.grid[state.currentGrid].reduce((prev, curr) => prev + curr);
  }

  return word;
}

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 650;

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;

    setTimeout(() => {
      if (letter === state.secret[i]) {
        box.classList.add("right");
      } else if (state.secret.includes(letter)) {
        box.classList.add("wrong");
      } else {
        box.classList.add("empty");
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add("animated");
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      alert("Congratulations!");
    } else if (isGameOver) {
      alert(`Better luck next time! The word was ${state.secret}`);
    }
  }, 3 * animation_duration);
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function isArrow(key) {
  const arrowKeyList = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  return arrowKeyList.includes(key);
}

function changeRowColKey(key) {
  const prevRow = state.currentRow;
  const prevCol = state.currentCol;

  if (key === "ArrowUp") {
    state.currentRow > 0 ? state.currentRow-- : null;
  }
  if (key === "ArrowDown") {
    state.currentRow < 5 ? state.currentRow++ : null;
  }
  if (key === "ArrowLeft") {
    state.currentCol > 0 ? state.currentCol-- : null;
  }
  if (key === "ArrowRight") {
    state.currentCol < 4 ? state.currentCol++ : null;
  }

  changeSelectedRowCol(prevRow, prevCol, state.currentRow, state.currentCol);
}

function changeRowColClick(prevRow, prevCol, currentRow, currentCol) {
  state.currentRow = currentRow;
  state.currentCol = currentCol;

  changeSelectedRowCol(prevRow, prevCol, currentRow, currentCol);
}

function changeSelectedRowCol(prevRow, prevCol, currentRow, currentCol) {
  const prevSelectedBox = document.getElementById(`box${prevRow}${prevCol}`);
  const newSelectedBox = document.getElementById(
    `box${currentRow}${currentCol}`
  );

  if (prevSelectedBox) prevSelectedBox.classList.remove("selected");
  if (newSelectedBox) newSelectedBox.classList.add("selected");

  changeGroupSelected(state.orientation, state.currentRow, state.currentCol);
}

function addLetter(letter) {
  const prevRow = state.currentRow;
  const prevCol = state.currentCol;

  if (state.orientation === "row") {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
  } else if (state.orientation === "col") {
    if (state.currentRow === 6) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentRow++;
  }

  if (state.currentCol === 5 || state.currentRow === 6) return;
  changeSelectedRowCol(prevRow, prevCol, state.currentRow, state.currentCol);
}

function removeLetter() {
  const prevRow = state.currentRow;
  const prevCol = state.currentCol;

  if (state.orientation === "row") {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = "";
    state.currentCol--;
  }

  if (state.orientation === "col") {
    if (state.currentRow === 0) return;
    state.grid[state.currentRow - 1][state.currentCol] = "";
    state.currentRow--;
  }

  changeSelectedRowCol(prevRow, prevCol, state.currentRow, state.currentCol);
}

function startup() {
  const game = document.getElementById("game");
  drawGrid(game);

  registerKeyboardEvents();
  registerClickEvents();

  const startingBox = document.getElementById("box00");
  startingBox.classList.add("selected");

  const startingRow = [
    document.getElementById("box00"),
    document.getElementById("box01"),
    document.getElementById("box02"),
    document.getElementById("box03"),
    document.getElementById("box04"),
  ];

  for (let i = 0; i < startingRow.length; i++) {
    startingRow[i].classList.add("groupselect");
  }
}

startup();
