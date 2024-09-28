const Player = (symbol) => {
  let playerSymbol = symbol;
  let playerNumber = gameController.playerList.length + 1;

  return { playerNumber, playerSymbol };
};

const gameController = (() => {
  let playerList = [];
  let gameWinner = false;

  document.querySelectorAll("td").forEach((tdBox) => {
    // Onclick listener added to all the boxes.
    tdBox.addEventListener("click", function () {
      displayController.addToBox(tdBox);
    });
  });

  const fetchCurrentPlayer = () => {
    // Find which player's turn it is based on number of moves.
    if (gameBoard.gameMoves % 2 == 0) return playerList[0];
    else return playerList[1];
  };

  const checkGameWinner = (symbolToSearch, currentRow, currentColumn) => {
    let rowWinner = false;
    rowWinner = checkRowWinner(symbolToSearch, currentRow); // Find if game is won based on row where symbol was inserted
    let columnWinner = false;
    columnWinner = checkColumnWinner(symbolToSearch, currentColumn); // Find if game is won based on column where symbol was inserted
    let diagWinner = false;
    diagWinner = checkDiagWinner(symbolToSearch); // Find if game is won based on diagonals.
    return !!(rowWinner || columnWinner || diagWinner);
  };

  const checkRowWinner = (symbolToSearch, currentRow) => {
    // Function to check if current row forms a series of same symbols
    let symbolPresentCount = 0;
    for (let i = 0; i <= 2; i++)
      if (gameBoard.gameState[currentRow][i] == symbolToSearch)
        symbolPresentCount++;
    if (symbolPresentCount == 3) {
      displayController.updateBackground("row", currentRow);
      return true;
    } else return false;
  };

  const checkColumnWinner = (symbolToSearch, currentColumn) => {
    // Function to check if current column forms a series of same symbols
    let symbolPresentCount = 0;
    for (let i = 0; i <= 2; i++)
      if (gameBoard.gameState[i][currentColumn] == symbolToSearch)
        symbolPresentCount++;
    if (symbolPresentCount == 3) {
      displayController.updateBackground("column", currentColumn);
      return true;
    } else return false;
  };

  const checkDiagWinner = (symbolToSearch) => {
    let symbolPresentCount = 0;
    // Diagonal being checked is of cells 0-0, 1-1 and 2-2. (Left to Right)
    for (let i = 0; i <= 2; i++)
      for (let j = 0; j <= 2; j++)
        if (i == j)
          if (gameBoard.gameState[i][j] == symbolToSearch) symbolPresentCount++;
    if (symbolPresentCount == 3) {
      displayController.updateBackground("diagonal");
      return true;
    }
    // Diagonal being checked is of cells 0-2, 1-1 and 2-0. (Right to Lefts)
    else symbolPresentCount = 0;
    for (let i = 0; i <= 2; i++)
      for (let j = 0; j <= 2; j++)
        if (i + j == 2)
          if (gameBoard.gameState[i][j] == symbolToSearch) symbolPresentCount++;
    if (symbolPresentCount == 3) {
      displayController.updateBackground("reverse-diagonal");
      return true;
    } else return false;
  };

  return {
    playerList,
    gameWinner,
    checkGameWinner,
    fetchCurrentPlayer,
  };
})();

const gameBoard = (() => {
  let gameMoves = 0;
  let gameState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]; // A GameBoard variable to hold the contents of the game i.e. where  which element is present so that winner can be found.

  const Player1 = Player("X");
  gameController.playerList.push(Player1);
  const Player2 = Player("O");
  gameController.playerList.push(Player2);

  const findElementPosition = (currentBox, positionType) => {
    // Find the matrix position of the current box that was clicked.
    let boxPosition = currentBox.getAttribute("data-matrix-position");
    if (positionType == "row") return parseInt(boxPosition.slice(0, 1));
    if (positionType == "column") return parseInt(boxPosition.slice(2));
  };

  const reset = () => {
    // Function to reset the elements of the Game.
    gameBoard.gameState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    gameBoard.gameMoves = 0;
    document.querySelectorAll("td").forEach((tdBox) => {
      tdBox.textContent = "";
      tdBox.style.backgroundColor = "";
    });
  };

  return {
    gameMoves,
    gameState,
    findElementPosition,
    reset,
  };
})();

const displayController = (() => {
  let resetButton = document.querySelector("#reset_game");
  resetButton.addEventListener("click", gameBoard.reset);

  const addToBox = (currentBox) => {
    // Function called when a tic-tac-toe box is clicked on.
    let validMove = false;
    if (currentBox.textContent == "" && ! gameController.gameWinner)
      validMove = true;
    if (validMove) {
      // Symbol is added if there is no winner yet and if current box is not filled.
      let currentPlayer = gameController.fetchCurrentPlayer();
      let currentPlayerSymbol = currentPlayer.playerSymbol;
      let currentRow = gameBoard.findElementPosition(currentBox, "row"); // Find the matrix row postion using the data attribute attached to the box.
      let currentColumn = gameBoard.findElementPosition(currentBox, "column"); // Find the matrix column postion using the data attribute attached to the box.
      gameBoard.gameState[currentRow][currentColumn] = currentPlayerSymbol; // GameBoard is updated to hold the symbol at the required position.
      gameBoard.gameMoves++;
      currentBox.textContent = currentPlayerSymbol;
      let winnerStatus = false;
      winnerStatus = gameController.checkGameWinner(
        currentPlayerSymbol,
        currentRow,
        currentColumn
      );
      if (winnerStatus) {
        alert(
          "Player " +
            currentPlayer.playerNumber +
            " (" +
            currentPlayerSymbol +
            ") has Won!"
        );
        gameController.gameWinner = true;
      }
      if (gameBoard.gameMoves == 9 && ! gameController.gameWinner) {
        // If no winner is found after 9 moves, game is tied.
        alert("Tie Game !");
        return;
      }
    }
  };

  const updateBackground = (elementType, elementIndex = 0) => {
    // Function to find and update the cells which form a series.
    let tdList, tdObjectList;
    if (elementType == "row") {
      tdList = [
        [elementIndex + "-0"],
        [elementIndex + "-1"],
        [elementIndex + "-2"],
      ];
      tdObjectList = findBoxes(tdList);
    } else if (elementType == "column") {
      tdList = [
        ["0-" + elementIndex],
        ["1-" + elementIndex],
        ["2-" + elementIndex],
      ];
      tdObjectList = findBoxes(tdList);
    } else if (elementType == "diagonal") {
      tdList = [["0-0"], ["1-1"], ["2-2"]];
      tdObjectList = findBoxes(tdList);
    } else if (elementType == "reverse-diagonal") {
      tdList = [["0-2"], ["1-1"], ["2-0"]];
      tdObjectList = findBoxes(tdList);
    }
    tdObjectList.forEach(function (tdBox) {
      tdBox.style.backgroundColor = "cornflowerblue";
    });
  };

  const findBoxes = (tdList) => {
    let returnList = [];
    for (let i = 0; i <= 2; i++) {
      document.querySelectorAll("td").forEach((currentBox) => {
        if (currentBox.getAttribute("data-matrix-position") == tdList[i]) {
          returnList.push(currentBox);
        }
      });
    }
    return returnList;
  };

  return {
    addToBox,
    updateBackground,
  };
})();
