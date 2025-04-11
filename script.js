const players = ["red", "blue"];
const hexScores = [[1, 1, 1, 2, 3, 1],
            [3, 4, 5, 5, 5, 6],
            [7, 8, 7, 8, 9, 8]];
let player = 0;
const totalTitans = 4;
let redTitans = [];
let blueTitans = [];
let redScore = 0;
let blueScore = 0;
let redTime = 150;
let blueTime = 150

const circles = document.getElementsByClassName("circle")

const connections = {};

const scoreDisplay = document.createElement("div");
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "20px";
scoreDisplay.style.left = "20px";
scoreDisplay.style.padding = "10px";
scoreDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
scoreDisplay.style.color = "white";
scoreDisplay.style.borderRadius = "5px";
scoreDisplay.style.fontSize = "18px";
scoreDisplay.style.zIndex = "100";
document.body.appendChild(scoreDisplay);

const turnIndicator = document.createElement("div");
turnIndicator.style.position = "absolute";
turnIndicator.style.top = "20px";
turnIndicator.style.right = "20px";
turnIndicator.style.padding = "10px";
turnIndicator.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
turnIndicator.style.color = "white";
turnIndicator.style.borderRadius = "5px";
turnIndicator.style.fontSize = "18px";
turnIndicator.style.zIndex = "100";
document.body.appendChild(turnIndicator);

function updateScoreDisplay() {
    scoreDisplay.innerHTML = `<span style="color: red;">Red: ${redScore}</span> <span style="border-radius: 5px; border-right: 5px solid red; border-bottom: 3px solid red; padding: 6px; margin-left: 4px">${Math.floor(redTime / 60)}:${redTime % 60 < 10 ? 0 : ""}${redTime % 60}</span> <span style="border-radius: 5px; border-left: 5px solid blue; border-top: 3px solid blue; padding: 6px; margin-right: 4px">${Math.floor(blueTime / 60)}:${blueTime % 60 < 10 ? 0 : ""}${blueTime % 60}</span> <span style="color: blue;">Blue: ${blueScore}</span>`;
    turnIndicator.innerHTML = `Current Turn: <span style="color: ${players[player]};">${players[player].toUpperCase()}</span>`;
    turnIndicator.style.borderLeft = `5px solid ${players[player]}`;
}

updateScoreDisplay();

document.querySelectorAll('.hex').forEach((hex, hexIndex) => {
    const elements = hex.getElementsByClassName("a");
    Array.from(elements).forEach((el, i) => {
        const div = document.createElement("div");
        const para = document.createElement("p");
        const node = document.createTextNode(`${hexScores[hexIndex][i]}`);
        para.appendChild(node);
        let translateX = 0;
        let left = 0;

        if (hexIndex === 0) {
            translateX = "calc(17.2vh + 10.3vw)";
            left = "64"
        } else if (hexIndex === 1) {
            translateX = "calc(10.39vh + 6.24vw)";
            left = "48"
        } else {
            translateX = "calc(5.2vh + 3.4vw)";
            left = "32"
        }

        para.style.position = "absolute";
        para.style.left = `${left}px`
        para.style.top = `-35px`
        para.style.transform = `translateX(${translateX}) rotate(-${60 * i + 330}deg)`;
        para.style.color = `rgba(220, 220, 255, 0.9)`;
        para.style.textShadow = "0 0 20px rgba(150, 150, 255, 0.6)";
        para.style.fontWeight = '500'
        para.style.fontSize = '16.5px'

        div.appendChild(para)

        div.style.position = "absolute";
        div.style.transform = `rotate(-30deg)`

        el.appendChild(div.cloneNode(true));
    });
});

document.querySelectorAll('.hex').forEach((hex, hexIndex) => {
    const aElements = hex.querySelectorAll('.a');

    aElements.forEach((a, sideIndex) => {
        const circle = a.querySelector('.circle');
        const circleKey = `${hexIndex + 1}-${sideIndex}`;
        circle.setAttribute("key", circleKey);

        if (!connections[circleKey]) connections[circleKey] = [`${hexIndex + 1}-${(sideIndex + 5) % 6}`, `${hexIndex + 1}-${(sideIndex + 1) % 6}`];
        else {
            connections[circleKey].push(`${hexIndex + 1}-${(sideIndex + 5) % 6}`);
            connections[circleKey].push(`${hexIndex + 1}-${(sideIndex + 1) % 6}`);
        }
        const radialConnections = a.querySelector('.connecta, .connectb')

        if (radialConnections) {
            const innerKey = `${hexIndex + 2}-${sideIndex}`
            connections[circleKey].push(innerKey)
            if (!connections[innerKey]) connections[innerKey] = [];
            connections[innerKey].push(circleKey);
        }
    })
})

console.log(connections);

function toggleCircleCursor(enable) {
    document.querySelectorAll('.circle').forEach(circle => {
      const isColored = circle.id === 'red' || circle.id === 'blue' || circle.id === 'green';
      if (enable) {
        if (isColored) {
          circle.style.cursor = 'pointer';
        } else {
          circle.style.cursor = 'auto';
        }
      }
    });
  }

let selected = null;
let gameOver = 0;

const completionCheck = () => {
    let hex3 = document.querySelector(".hex3");
    let completed = 0;
    hex3.querySelectorAll('.a').forEach((a, sideIndex) => {
        const circle = a.querySelector('.circle');
        if (circle.id) {
            completed += 1;
        }
    })

    if (completed == 6) {
        gameOver = 1;
    }
    console.log(gameOver);
}

const calcScore = () => {
    let redAdjacent = [];
    redTitans.forEach(loc => {
        
    })
}

const changeTime = () => {
    const redTimer = () => {
        if (!redTime || player) return;
        redTime -= 1;
        updateScoreDisplay();
        setTimeout(redTimer, 1000);
    }
    const blueTimer = () => {
        if (!blueTime || !player) return;
        blueTime -= 1;
        updateScoreDisplay();
        setTimeout(blueTimer, 1000);
    }

    if (!player) {
        redTimer();
    } else {
        blueTimer();
    }
}

changeTime();

Array.from(circles).forEach(circle => {
    circle.addEventListener("click", () => {
        if (redTitans.length + blueTitans.length < 8) {
            if (!circle.id) {
                if (circle.getAttribute("key")[0] == "1") {
                circle.id = players[player];
                player ? blueTitans.push(circle.getAttribute("key")) : redTitans.push(circle.getAttribute("key"));
                player = (player + 1) % 2;
                changeTime();
                updateScoreDisplay();
                } else if (circle.getAttribute("key")[0] == "2") {
                    if (redTitans.length + blueTitans.length >= 6) {
                        circle.id = players[player];
                        player ? blueTitans.push(circle.getAttribute("key")) : redTitans.push(circle.getAttribute("key"));
                        player = (player + 1) % 2;
                        changeTime();
                        updateScoreDisplay();
                        if (redTitans.length + blueTitans.length == 8) {
                            toggleCircleCursor(true)
                        }
                    }
                }
            }
        } else {
            if (circle.id == players[player]) {
                selected = circle;
                console.log(selected.getAttribute("key"));
            } else {
                if (selected && connections[selected.getAttribute("key")].includes(circle.getAttribute("key")) && !circle.id) {
                    circle.id = players[player];
                    selected.id = "";
                    selected = null;
                    player = (player + 1) % 2;
                    changeTime();
                    toggleCircleCursor(true)
                    updateScoreDisplay();
                    completionCheck();
                }
            }
        }

        calcScore();
    })
});

