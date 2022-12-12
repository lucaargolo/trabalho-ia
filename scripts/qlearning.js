const learner = new QLearner(0.8, 0.8)
const exploration = 0.1

let train = true
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
        learner.learn(100);

        updateGameCanvas()
        updateGameState()
    } else if (player === 'X' && !gameOver && train === true) {
        let emptyStates = []
        for (let s in states) {
            if (states[s] === '') {
                emptyStates.push(s)
            }
        }
        states[parseInt(emptyStates[Math.floor(Math.random() * emptyStates.length)])] = 'X'
        updateGameCanvas()
        updateGameState()
    } else if (gameOver && train === true) {
        qState.innerText = "Robô: "+((oWins/wins)*100).toFixed(2)+"%\nPlayer: "+((xWins/wins)*100).toFixed(2)+"%"
        await new Promise(r => setTimeout(r, 50));
        restart.click()
    }
}

const qlearningGame = document.getElementById("game4")
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
        }
    }else{
        if(qlearningEnabled) {
            canvas.removeEventListener("update_game_state", updateQlearning)
            console.log("[Q-learning] Desligando q-learning!")
            qlearningEnabled = false
        }
    }
})

const qState = document.getElementById("q-state")
const qTrain = document.getElementById("train")

qTrain.addEventListener("click", () => {
    train = !train
})