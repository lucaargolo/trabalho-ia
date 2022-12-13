const form = document.getElementById("form")
const state = document.getElementById("state")
const restart = document.getElementById("restart")

const playerStarts = document.getElementById("player")
const robotStarts = document.getElementById("robot")

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;
ctx.font = "64px sans-serif";
ctx.textAlign = "center";

let starts = 'X'
let player = starts;
if(starts === 'X') {
    state.innerText = "Hora do jogador: X"
}else{
    state.innerText = "Hora do robô: O"
}

let gameOver = false;
let states = ['', '', '', '', '', '', '', '', ''];

let training = false;
const trainingState = document.getElementById("training-state")
const episodes = document.getElementById("episodes")
const episodesDisplay = document.getElementById("episodesDisplay")
let realEpisodes = 0

const matches = document.getElementById("matches")
const playerPercentage = document.getElementById("player-percentage")
const robotPercentage = document.getElementById("robot-percentage")
const tiePercentage = document.getElementById("tie-percentage")
const resetStats = document.getElementById("reset-stats")
trainingState.addEventListener("click", function(e) {
  training = !training
  if(training) {
      canvas.dispatchEvent(new Event("update_game_state"))
      trainingState.innerText = "Parar Treino"
  }else{
      trainingState.innerText = "Iniciar Treino"
  }
})

restart.addEventListener("click", function(e) {
    console.log("[Game] Reiniciando jogo!")
    player = starts;
    if(player === 'X') {
        state.innerText = "Hora do jogador: X"
    }else{
        state.innerText = "Hora do robô: O"
    }
    gameOver = false;
    states = ['', '', '', '', '', '', '', '', ''];
    updateGameCanvas()
    canvas.dispatchEvent(new Event("update_game_state"))
})

canvas.addEventListener("click", function(e) {
    if (gameOver) {
        return;
    }

    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let col = Math.floor(x / 83);
    let row = Math.floor(y / 83);
    let index = (row * 3) + col

    if (states[index] !== '') {
        return;
    }

    states[index] = player;

    updateGameCanvas();
    updateGameState();
});

function updateGameCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(83, 0);
    ctx.lineTo(83, 250);
    ctx.moveTo(166, 0);
    ctx.lineTo(166, 250);
    ctx.moveTo(0, 83);
    ctx.lineTo(250, 83);
    ctx.moveTo(0, 166);
    ctx.lineTo(250, 166);
    ctx.stroke();

    let x = 83/2
    let y = 83/2 + 83/4
    states.forEach((char) => {
        if(char === 'X') {
            ctx.fillStyle = "blue"
        }else{
            ctx.fillStyle = "red"
        }
        ctx.fillText(char, x, y)
        x += 83
        if(x >= 83*3) {
            x = 83/2
            y += 83
        }
    })
}

function checkWinState(test) {

    for(let row = 0; row < 3; row++) {
        if (states[row * 3] !== '' && states[row * 3] === states[(row * 3) + 1] && states[(row * 3) + 1] === states[(row * 3) + 2]) {
            if(test === false) {
                let winState = ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R']
                winState[row * 3] = 'E'
                winState[(row * 3) + 1] = 'E'
                winState[(row * 3) + 2] = 'E'
                drawVictory(winState)
            }
            return states[row * 3]
        }
    }

    for(let col = 0; col < 3; col++) {
        if (states[col] !== '' && states[col] === states[3 + col] && states[3 + col] === states[6 + col]) {
            if(test === false) {
                let winState = ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R']
                winState[col] = 'E'
                winState[3 + col] = 'E'
                winState[6 + col] = 'E'
                drawVictory(winState)
            }
            return states[col]
        }
    }

    if (states[0] !== '' && states[0] === states[4] && states[4] === states[8]) {
        if(test === false && states[0] !== '') {
            let winState = ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R']
            winState[0] = 'E'
            winState[4] = 'E'
            winState[8] = 'E'
            drawVictory(winState)
        }
        return states[0]
    }

    if (states[2] !== '' && states[2] === states[4] && states[4] === states[6]) {
        if(test === false && states[2] !== '') {
            let winState = ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R']
            winState[2] = 'E'
            winState[4] = 'E'
            winState[6] = 'E'
            drawVictory(winState)
        }
        return states[2]
    }

    return '';
}

function updateGameState() {
    let win = checkWinState(false)
    if(win !== '' || !states.includes('')) {
        gameOver = true
        if(win !== '') {
            canvas.dispatchEvent(new Event("win"))
            state.innerText = "Jogador "+player+" ganhou!"
        }else{
            canvas.dispatchEvent(new Event("tie"))
            state.innerText = "Empate!"
        }
    }
    if (player === "X") {
        if(!gameOver) state.innerText = "Hora do robô: O"
        player = "O";
    } else {
        if(!gameOver) state.innerText = "Hora do jogador: X"
        player = "X";
    }
    canvas.dispatchEvent(new Event("update_game_state"))
}

function drawVictory(winState) {
    let x = 83/2
    let y = 83/2
    let moved = false

    ctx.beginPath();
    winState.forEach((char) => {
        if (char === 'E') {
            if (!moved) {
                moved = true
                ctx.moveTo(x, y)
            }else{
                ctx.lineTo(x, y)
            }
        }
        x += 83
        if(x >= 83*3) {
            x = 83/2
            y += 83
        }
    })
    ctx.stroke();
}

updateGameCanvas()
canvas.dispatchEvent(new Event("update_game_state"))

canvas.addEventListener("update_game_state", async () => {
    if (training) {
        if (gameOver) {
            if (realEpisodes > 0) {
                realEpisodes--
                episodes.value = Math.ceil(realEpisodes/100)*100
                episodesDisplay.innerText = realEpisodes
                if(realEpisodes === 0) {
                    episodes.value = -100
                    training = false
                    trainingState.innerText = "Iniciar Treino"
                    episodesDisplay.innerText = "∞"
                }
            }
            await new Promise(r => setTimeout(r, 25));
            restart.click()
        } else if (player === 'X' && episodes.value !== "0") {
            let emptyStates = []
            for (let s in states) {
                if (states[s] === '') {
                    emptyStates.push(s)
                }
            }
            states[parseInt(emptyStates[Math.floor(Math.random() * emptyStates.length)])] = 'X'
            updateGameCanvas()
            updateGameState()
        }
    }
})
form.addEventListener("input", () => {
    realEpisodes = parseInt(episodes.value)
    if(realEpisodes > 0) {
        episodesDisplay.innerText = realEpisodes
    }else{
        episodesDisplay.innerText = "∞"
    }
    if(robotStarts.checked && starts !== 'O') {
        starts = 'O'
        console.log("[Game] Mudando jogador inicial para robô")
        if(!states.includes('X') && !states.includes('O')) {
            restart.click()
        }
    }
    if(playerStarts.checked && starts !== 'X') {
        starts = 'X'
        console.log("[Game] Mudando jogador inicial para player")
        if(!states.includes('X') && !states.includes('O')) {
            restart.click()
        }
    }
})