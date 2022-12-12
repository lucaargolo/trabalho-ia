function updateRandom() {
    if(player === 'O' && !gameOver) {
        let emptyStates = []
        for (let s in states) {
            if (states[s] === '') {
                emptyStates.push(s)
            }
        }
        states[parseInt(emptyStates[Math.floor(Math.random() * emptyStates.length)])] = 'O'
        updateGameCanvas()
        updateGameState()
    }
}

const randomGame = document.getElementById("game2")
let randomEnabled = false

form.addEventListener("input", () => {
    if(randomGame.checked) {
        if(!randomEnabled) {
            canvas.addEventListener("update_game_state", updateRandom)
            console.log("[Aleatório] Ligando aleatório!")
            randomEnabled = true
            if(player === 'O') {
                updateRandom()
            }
            updateRandomStats()
        }
    }else{
        if(randomEnabled) {
            canvas.removeEventListener("update_game_state", updateRandom)
            console.log("[Aleatório] Desligando aleatório!")
            randomEnabled = false
        }
    }
})

let randomMatches = 0
let randomPlayerWins = 0
let randomRobotWins = 0
let randomTies = 0

canvas.addEventListener("win", () => {
    if(randomEnabled) {
        randomMatches++
        if(player === 'X') {
            randomPlayerWins++
        }else{
            randomRobotWins++
        }
        updateRandomStats()
    }
})

canvas.addEventListener("tie", () => {
    if(randomEnabled) {
        randomMatches++
        randomTies++
        updateRandomStats()
    }
})

resetStats.addEventListener("click", () => {
    if(randomEnabled) {
        randomMatches = 0
        randomPlayerWins = 0
        randomRobotWins = 0
        randomTies = 0
        updateRandomStats()
    }
})

function updateRandomStats() {
    if(randomMatches > 0) {
        matches.innerText = "Partidas: " + randomMatches
        playerPercentage.innerText = "Vitórias do Player: " + ((randomPlayerWins / randomMatches) * 100).toFixed(2) + "%"
        robotPercentage.innerText = "Vitórias do Robô: " + ((randomRobotWins / randomMatches) * 100).toFixed(2) + "%"
        tiePercentage.innerText = "Empates: " + ((randomTies / randomMatches) * 100).toFixed(2) + "%"
    }else{
        matches.innerText = "Partidas: 0"
        playerPercentage.innerText = "Vitórias do Player: 0%"
        robotPercentage.innerText = "Vitórias do Robô: 0%"
        tiePercentage.innerText = "Empates: 0%"
    }
}