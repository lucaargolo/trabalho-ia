const learner = new QLearner(0.2, 0.8)
const exploration = 0.05
function updateQlearning() {
    if (player === 'O' && !gameOver) {
        let currentState = states.toString()

        let action = learner.bestAction(currentState);

        //if there is no best action try to explore
        if ((action === undefined) || (learner.getQValue(currentState, action) <= 0) || (Math.random() < exploration) || states[action] !== '') {
            let emptyStates = []
            for (let s in states) {
                if (states[s] === '') {
                    emptyStates.push(s)
                }
            }
            action = parseInt(emptyStates[Math.floor(Math.random() * emptyStates.length)]);
        }

        //action is a number -1,0,+1
        action = parseInt(action)

        //apply the action
        states[action] = 'O'

        let reward
        let win = checkWinState(true)
        if(win === 'O') {
            reward = 10
        }else if(win === 'X') {
            reward = -10
        }else{
            reward = 0
        }

        const nextState = states.toString()
        learner.add(currentState, nextState, reward, action);

        //make que q-learning algorithm number of iterations=10 or it could be another number
        learner.learn(10);

        updateGameCanvas()
        updateGameState()
    }
}

const qlearningGame = document.getElementById("game5")
let qlearningEnabled = false

form.addEventListener("input", () => {
    if(qlearningGame.checked) {
        if(!qlearningEnabled) {
            canvas.addEventListener("update_game_state", updateQlearning)
            console.log("[Q-learning] Ligando q-learning!")
            qlearningEnabled = true
            if(player === 'O') {
                updateQlearning()
            }
            updateQLearningStats()
        }
    }else{
        if(qlearningEnabled) {
            canvas.removeEventListener("update_game_state", updateQlearning)
            console.log("[Q-learning] Desligando q-learning!")
            qlearningEnabled = false
        }
    }
})

let qLearningMatches = 0
let qLearningPlayerWins = 0
let qLearningRobotWins = 0
let qLearningTies = 0

canvas.addEventListener("win", () => {
    if(qlearningEnabled) {
        qLearningMatches++
        if (player === 'X') {
            qLearningPlayerWins++
        } else {
            qLearningRobotWins++
        }
        updateQLearningStats()
    }
})

canvas.addEventListener("tie", () => {
    if(qlearningEnabled) {
        qLearningMatches++
        qLearningTies++
        updateQLearningStats()
    }
})

resetStats.addEventListener("click", () => {
    if(qlearningEnabled) {
        qLearningMatches = 0
        qLearningPlayerWins = 0
        qLearningRobotWins = 0
        qLearningTies = 0
        updateQLearningStats()
    }
})

function updateQLearningStats() {
    if(qLearningMatches > 0) {
        matches.innerText = "Partidas: " + qLearningMatches
        playerPercentage.innerText = "Vit??rias do Player: " + ((qLearningPlayerWins / qLearningMatches) * 100).toFixed(2) + "%"
        robotPercentage.innerText = "Vit??rias do Rob??: " + ((qLearningRobotWins / qLearningMatches) * 100).toFixed(2) + "%"
        tiePercentage.innerText = "Empates: " + ((qLearningTies / qLearningMatches) * 100).toFixed(2) + "%"
    }else{
        matches.innerText = "Partidas: 0"
        playerPercentage.innerText = "Vit??rias do Player: 0%"
        robotPercentage.innerText = "Vit??rias do Rob??: 0%"
        tiePercentage.innerText = "Empates: 0%"
    }
}