function evaluateExpectimax() {
    let win = checkWinState(true)
    if(win === 'O') {
        return 10;
    }else if(win === 'X') {
        return -10
    }else{
        return 0
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

const expectimaxGame = document.getElementById("game4")
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
            updateExpectimaxStats()
        }
    }else{
        if(expectimaxEnabled) {
            canvas.removeEventListener("update_game_state", updateExpectimax)
            console.log("[Expectimax] Desligando expectimax!")
            expectimaxEnabled = false
        }
    }
})

let expectimaxMatches = 0
let expectimaxPlayerWins = 0
let expectimaxRobotWins = 0
let expectimaxTies = 0

canvas.addEventListener("win", () => {
    if(expectimaxEnabled) {
        expectimaxMatches++
        if (player === 'X') {
            expectimaxPlayerWins++
        } else {
            expectimaxRobotWins++
        }
        updateExpectimaxStats()
    }
})

canvas.addEventListener("tie", () => {
    if(expectimaxEnabled) {
        expectimaxMatches++
        expectimaxTies++
        updateExpectimaxStats()
    }
})

resetStats.addEventListener("click", () => {
    if(expectimaxEnabled) {
        expectimaxMatches = 0
        expectimaxPlayerWins = 0
        expectimaxRobotWins = 0
        expectimaxTies = 0
        updateExpectimaxStats()
    }
})

function updateExpectimaxStats() {
    if(expectimaxMatches > 0) {
        matches.innerText = "Partidas: " + expectimaxMatches
        playerPercentage.innerText = "Vitórias do Player: " + ((expectimaxPlayerWins / expectimaxMatches) * 100).toFixed(2) + "%"
        robotPercentage.innerText = "Vitórias do Robô: " + ((expectimaxRobotWins / expectimaxMatches) * 100).toFixed(2) + "%"
        tiePercentage.innerText = "Empates: " + ((expectimaxTies / expectimaxMatches) * 100).toFixed(2) + "%"
    }else{
        matches.innerText = "Partidas: 0"
        playerPercentage.innerText = "Vitórias do Player: 0%"
        robotPercentage.innerText = "Vitórias do Robô: 0%"
        tiePercentage.innerText = "Empates: 0%"
    }
}