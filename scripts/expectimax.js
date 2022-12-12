function evaluateExpectimax() {
    let robotWin = checkWinState('O')
    let playerWin = checkWinState('X')
    if(robotWin === false && playerWin === false) {
        return 0;
    }else if(robotWin === true) {
        return 10;
    }else {
        return -10;
    }
}

function expectimax(depth, isMax) {
    let score = evaluateExpectimax();

    if (score === 10) {
        return score;
    }else if (score === -10) {
        return score;
    }else if (!states.includes('')) {
        return 0;
    }

    if (isMax) {
        let best = -Infinity;
        for(let index = 0; index < 9; index++) {
            if (states[index] === '') {
                states[index] = 'O';
                best = Math.max(best, expectimax(depth + 1, false));
                states[index] = '';
            }
        }
        return best;
    } else {
        let qnt = 0
        let sum = 0;
        for(let index = 0; index < 9; index++) {
            if (states[index] === '') {
                qnt++;
                states[index] = 'X';
                sum += expectimax(depth + 1, true)
                states[index] = '';
            }
        }
        return sum/qnt;
    }
}

function findBestExpectimaxMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;
    for(let index = 0; index < 9; index++) {
        if (board[index] === '') {
            board[index] = 'O';
            let moveVal = expectimax(board, 0, false);
            board[index] = '';
            if (moveVal > bestVal) {
                bestMove = index;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function updateExpectimax() {
    if(player === 'O' && !gameOver) {
        let startTime = performance.now()
        states[findBestExpectimaxMove(states)] = 'O'
        let endTime = performance.now()
        console.log("[Expectimax] O algorítmo demorou "+(endTime-startTime)+"ms para tomar uma decisão.")
        updateGameCanvas()
        updateGameState()
    }
}

const expectimaxGame = document.getElementById("game3")
let expectimaxEnabled = false

form.addEventListener("input", () => {
    if(expectimaxGame.checked) {
        if(!expectimaxEnabled) {
            canvas.addEventListener("update_game_state", updateExpectimax)
            console.log("[Expectimax] Ligando expectimax!")
            expectimaxEnabled = true
            if(player === 'O') {
                updateExpectimax()
            }
        }
    }else{
        if(expectimaxEnabled) {
            canvas.removeEventListener("update_game_state", updateExpectimax)
            console.log("[Expectimax] Desligando expectimax!")
            expectimaxEnabled = false
        }
    }
})