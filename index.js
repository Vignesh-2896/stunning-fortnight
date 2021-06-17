const gameController = (() => {
  
    let currentPlayer = 0;
    let playerList = [];
    let winner = false;
    let gameMoves = 0;
    let gameState = [["","",""],["","",""],["","",""]];

    const Player = (playerName, playerSymbol) => {
        let moveSymbol = playerSymbol;
        return {playerName, moveSymbol};
    };

    function startGame(userList){
        setUpArray();
        playerList = userList;
    };

    function setUpArray(){
        document.querySelectorAll("td").forEach(tdBox => {
            tdBox.addEventListener("click",function(){
                addXO(tdBox);
            });
        });
    };

    function addXO(currentBox){
        currentPlayer = fetchCurrentPlayer();
        if(currentBox.textContent == "" && winner == false){
            currentBox.textContent = currentPlayer.moveSymbol;
            let currentRow = findElementDetails(currentBox,"row");
            let currentColumn = findElementDetails(currentBox,"column");
            gameState[currentRow][currentColumn] = currentPlayer.moveSymbol;
            gameMoves ++;
            let winnerStatus = false; winnerStatus = checkGameWinner(currentPlayer.moveSymbol, currentRow, currentColumn);
            if(winnerStatus == true){
                alert(currentPlayer.playerName+" has won !")
                winner = true;
            }
            if(gameMoves == 9){
                alert("Tie Game !");
                return;
            }            
        }
    };

    function fetchCurrentPlayer(){
        if(gameMoves%2 == 0) return playerList[0];
        else return playerList[1];
    };

    function checkGameWinner(symbolToSearch, currentRow, currentColumn){
        let rowWinner = false; rowWinner = checkRowWinner(symbolToSearch, currentRow);
        let columnWinner = false; columnWinner = checkColumnWinner(symbolToSearch, currentRow);
        let diagWinner = false;   diagWinner = checkDiagWinner(symbolToSearch);
        if(rowWinner || columnWinner || diagWinner){
            return true;
        } else {
            return false;
        }
    };

    function checkRowWinner(symbolToSearch, currentRow){
        symbolPresentCount = 0;
        for(let i =0;i<=2;i++) if(gameState[currentRow][i] == symbolToSearch) symbolPresentCount++;
        if(symbolPresentCount == 3){
            updateBackground("row",currentRow);
            return true;
        }
        else return false;
    }

    function checkColumnWinner(symbolToSearch, currentColumn){
        symbolPresentCount = 0;
        for(let i =0;i<=2;i++) if(gameState[i][currentColumn] == symbolToSearch) symbolPresentCount++;
        if(symbolPresentCount == 3){
            updateBackground("column",currentColumn);
            return true;
        }
        else return false;
    }

    function checkDiagWinner(symbolToSearch){
        symbolPresentCount = 0;
        for(let i=0;i<=2;i++) for(let j=0;j<=2;j++) if(i==j) if(gameState[i][j] == symbolToSearch) symbolPresentCount++;
        if(symbolPresentCount == 3){
            updateBackground("diagonal");
            return true;
        }
        else symbolPresentCount = 0; for(let i=0;i<=2;i++) for(let j=0;j<=2;j++) if(i+j == 2) if(gameState[i][j] == symbolToSearch) symbolPresentCount++;
        if(symbolPresentCount == 3){
            updateBackground("reverse-diagonal");
            return true;
        }
        else return false;
    }

    function findElementDetails(currentBox, lineType){
        boxPosition = currentBox.getAttribute("data-game-pos");
        if(lineType == "row") return parseInt(boxPosition.slice(0,1));
        if(lineType == "column") return parseInt(boxPosition.slice(2));
    }

    function updateBackground(elementType, elementIndex = 0){
        if(elementType == "row"){
            tdList = [[elementIndex+"-0"],[elementIndex+"-1"],[elementIndex+"-2"]];
            tdObjectList = findBoxes(tdList);
        } else if(elementType == "column"){
            tdList = [["0-"+elementIndex],["1-"+elementIndex],["2-"+elementIndex]];
            tdObjectList = findBoxes(tdList);            
        } else if(elementType == "diagonal"){
            tdList = [["0-0"],["1-1"],["2-2"]];
            tdObjectList = findBoxes(tdList);            
        } else if(elementType == "reverse-diagonal"){
            tdList = [["0-2"],["1-1"],["2-0"]];
            tdObjectList = findBoxes(tdList);      
        }
        tdObjectList.forEach(function(tdBox){
            tdBox.style.backgroundColor = "blue";
        })
    }


    function findBoxes(tdList){
        let i = 0; returnList = [] ;
        for(let i =0;i<=2;i++){
            document.querySelectorAll("td").forEach(currentBox => {
                if(currentBox.getAttribute("data-game-pos") == tdList[i]){
                    returnList.push(currentBox);
                    return;
                }
            });
        }
        return returnList;
    }

    return {
        startGame,
        Player,
    };
})();

player1 = gameController.Player("Jim","X");
player2 = gameController.Player("Dwight","O");
gameController.startGame([player1, player2]);