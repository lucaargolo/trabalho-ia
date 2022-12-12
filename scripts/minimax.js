function evaluateMinimax() {
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

function minimax(depth, isMax) {
    let score = evaluateMinimax();

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
                best = Math.max(best, minimax(depth + 1, false));
                states[index] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for(let index = 0; index < 9; index++) {
            if (states[index] === '') {
                states[index] = 'X';
                best = Math.min(best, minimax(depth + 1, true));
                states[index] = '';
            }
        }
        return best;
    }
}

function findBestMinimaxMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;
    for(let index = 0; index < 9; index++) {
        if (board[index] === '') {
            board[index] = 'O';
            let moveVal = minimax(board, 0, false);
            board[index] = '';
            if (moveVal > bestVal) {
                bestMove = index;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function updateMinimax() {
    if(player === 'O' && !gameOver) {
        let startTime = performance.now()
        states[findBestMinimaxMove(states)] = 'O'
        let endTime = performance.now()
        console.log("[Minimax] O algorítmo demorou "+(endTime-startTime)+"ms para tomar uma decisão.")
        updateGameCanvas()
        updateGameState()
    }
}

const minimaxGame = document.getElementById("game2")
let minimaxEnabled = false

form.addEventListener("input", () => {
    if(minimaxGame.checked) {
        if(!minimaxEnabled) {
            canvas.addEventListener("update_game_state", updateMinimax)
            console.log("[Minimax] Ligando minimax!")
            minimaxEnabled = true
            if(player === 'O') {
                updateMinimax()
            }
        }
    }else{
        if(minimaxEnabled) {
            canvas.removeEventListener("update_game_state", updateMinimax)
            console.log("[Minimax] Desligando minimax!")
            minimaxEnabled = false
        }
    }
})