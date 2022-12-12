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
state.innerText = "Hora do jogador: "+starts

let gameOver = false;
let states = ['', '', '', '', '', '', '', '', ''];

const winStates = [
    ['E', 'E', 'E', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['R', 'R', 'R', 'E', 'E', 'E', 'R', 'R', 'R'],
    ['R', 'R', 'R', 'R', 'R', 'R', 'E', 'E', 'E'],
    ['E', 'R', 'R', 'E', 'R', 'R', 'E', 'R', 'R'],
    ['R', 'E', 'R', 'R', 'E', 'R', 'R', 'E', 'R'],
    ['R', 'R', 'E', 'R', 'R', 'E', 'R', 'R', 'E'],
    ['E', 'R', 'R', 'R', 'E', 'R', 'R', 'R', 'E'],
    ['R', 'R', 'E', 'R', 'E', 'R', 'E', 'R', 'R'],
]

restart.addEventListener("click", function(e) {
    console.log("[Game] Reiniciando jogo!")
    player = starts;
    state.innerText = "Hora do jogador: "+starts
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

function checkWinState(player) {
    let win = false;
    winStates.forEach((winState) => {
        let lastIndex = 0
        for(let index in winState) {
            let checkChar = winState[index]
            if (!((checkChar === 'R') || (checkChar === 'E' && player === states[index]))) {
                break;
            }
            lastIndex = parseInt(index)
        }
        if(lastIndex === 8 && win === false) {
            drawVictory(winState)
            win = true
        }
    })
    return win;
}

function updateGameState() {
    let win = checkWinState(player)
    if(win || !states.includes('')) {
        gameOver = true
        if(win) {
            state.innerText = "Jogador "+player+" ganhou!"
        }else{
            state.innerText = "Empate!"
        }
    }
    if (player === "X") {
        if(!gameOver) state.innerText = "Hora do jogador: O"
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
form.addEventListener("input", () => {
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