const learner = new QLearner(0.2, 0.8)
const exploration = 0.05
async function updateQlearning() {
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
        let robotWin = checkWinState('O')
        let playerWin = checkWinState('X')
        if (robotWin === false && playerWin === false) {
            reward = 0;
        } else if (robotWin === true) {
            reward = 10;
        } else {
            reward = -10;
        }

        const nextState = states.toString()
        learner.add(currentState, nextState, reward, action);

        //make que q-learning algorithm number of iterations=10 or it could be another number
        learner.learn(1);

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
        playerPercentage.innerText = "Vitórias do Player: " + ((qLearningPlayerWins / qLearningMatches) * 100).toFixed(2) + "%"
        robotPercentage.innerText = "Vitórias do Robô: " + ((qLearningRobotWins / qLearningMatches) * 100).toFixed(2) + "%"
        tiePercentage.innerText = "Empates: " + ((qLearningTies / qLearningMatches) * 100).toFixed(2) + "%"
    }else{
        matches.innerText = "Partidas: 0"
        playerPercentage.innerText = "Vitórias do Player: 0%"
        robotPercentage.innerText = "Vitórias do Robô: 0%"
        tiePercentage.innerText = "Empates: 0%"
    }
}