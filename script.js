const players = ["red", "blue"];

const redRoasts = [
    "Red showed up to win, but left as a warm shade of shame.",
    "Red didn’t just lose—they bled out on the scoreboard.",
    "The only thing red about that performance was the embarrassment level.",
    "Red was so bad, the color wheel tried to kick them out.",
    "Red’s gameplay was so tragic, even the devil filed a restraining order.",
    "Red got cooked so hard, even lobsters were like ‘damn, chill.’",
    "Red came in hot and left as ash.",
    "If Red loses one more time, they’re getting demoted to magenta."
];

const blueRoasts = [
    "Blue’s so bad, even Bluetooth disconnected in shame.",
    "They call it true blue—but nothing true about those fake plays.",
    "Blue caught that L so hard, it turned into blew—as in they blew it.",
    "Blue's game was so off, even Clue couldn’t figure out what they were doing.",
    "Blue played like they were stuck in glue—slow, stuck, and sad.",
    "Blue pulled up, made a move, and instantly got booed—classic.",
    "There’s no value in Blue—just Ls on auto-renew.",
    "Blue’s plans fell through faster than a wet tissue.",
    "Blue so clueless, even Blue’s Clues gave up on them.",
    "Blue’s performance? A tragedy in hue—same shade as defeat."
];  

let player = 0;
const totalTitans = 4;
let redTitans = new Set([]);
let blueTitans = new Set([]);
let redScore = 0;
let blueScore = 0;
let redTime = 150;
let blueTime = 150;
let dragging = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let game = 0;

let hexScores = [];
let connectScores = [];
for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 6; j++) {
        row.push(i == 0 ? Math.floor((3 * Math.random() + 1)) : i == 1 ? Math.floor((4 * Math.random() + 3)) : Math.floor(7 + 3 * Math.random()));
    }
    hexScores.push(row);
}

for (let i = 0; i < 2; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
        row.push(i == 0 ? Math.floor((4 * Math.random() + 3)) : Math.floor(7 + 3 * Math.random()));
    }
    connectScores.push(row);
}
console.log(connectScores);
console.log(hexScores);

const circles = document.getElementsByClassName("circle");
const neighbours = {};

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

const TitansLeft = document.createElement('div');
TitansLeft.style.position = 'absolute';
TitansLeft.style.left = "40px";
TitansLeft.style.top = "70px";
TitansLeft.style.display = 'flex';


document.body.appendChild(TitansLeft);

const blueTitansLeft = document.createElement("div");
blueTitansLeft.style.position = "relative";
blueTitansLeft.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
blueTitansLeft.style.height = "100px";
blueTitansLeft.style.width = "100px";
blueTitansLeft.style.borderRadius = "5px";
blueTitansLeft.style.display = "grid";
blueTitansLeft.style.gridTemplateColumns = "auto auto";

const redTitansLeft = document.createElement("div");
redTitansLeft.style.position = "relative";
redTitansLeft.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
redTitansLeft.style.height = "100px";
redTitansLeft.style.width = "100px";
redTitansLeft.style.borderRadius = "5px";
redTitansLeft.style.display = "grid";
redTitansLeft.style.gridTemplateColumns = "auto auto";

TitansLeft.appendChild(redTitansLeft);
TitansLeft.appendChild(blueTitansLeft);

const numOfPieces = () => {
    if (player || !game) {
        redTitansLeft.innerText = '';

        for (let i = 4; i > redTitans.size; i--) {
            let para = document.createElement("div");
            para.classList.add('titans');
            para.id = "red";
            para.setAttribute("key", 5 - i);

            para.style.position = "relative";
            para.style.cursor = !player ? "grab" : "auto";
            para.style.transition = "0.05s ease"; 

            para.addEventListener('mousedown', (e) => {
                if (!player) {
                    e.preventDefault();

                    const rect = para.getBoundingClientRect();
                    dragOffsetX = e.clientX - rect.left;
                    dragOffsetY = e.clientY - rect.top;
                    
                    dragging = para;
                    para.style.cursor = "grabbing";
                    para.style.transform = "scale(1.05)";
                    para.style.position = "absolute";
                    para.style.zIndex = "1000";
                    para.style.left = `${e.clientX - dragOffsetX}px`;
                    para.style.top = `${e.clientY - dragOffsetY}px`;

                    document.body.appendChild(para);
                }
            });

            redTitansLeft.appendChild(para);
        }
    }

    if (!player || !game) {
        blueTitansLeft.innerText = '';

        for (let i = 4; i > blueTitans.size; i--) {
            let para = document.createElement("div");
            para.classList.add('titans');
            para.id = "blue";
            para.setAttribute("key", 5 - i);
            
            para.style.position = "relative";
            para.style.cursor = player ? "grab" : "auto";
            para.style.transition = "0.05s ease"; 

            para.addEventListener('mousedown', (e) => {
                if (player) {
                    e.preventDefault();

                    const rect = para.getBoundingClientRect();
                    dragOffsetX = e.clientX - rect.left;
                    dragOffsetY = e.clientY - rect.top;
                    
                    dragging = para;
                    para.style.cursor = "grabbing";
                    para.style.transform = "scale(1.05)";
                    para.style.position = "absolute";
                    para.style.zIndex = "1000";
                    para.style.left = `${e.clientX - dragOffsetX}px`;
                    para.style.top = `${e.clientY - dragOffsetY}px`;

                    document.body.appendChild(para);
                }
            });

            blueTitansLeft.appendChild(para);
        }
    }
    game = 1;
}

numOfPieces();

document.addEventListener("mouseup", () => {
    if (dragging) {
        if (player) {
            blueTitansLeft.appendChild(dragging);
        } else {
            redTitansLeft.appendChild(dragging)
        }
        dragging.style.cursor = "grab";
        dragging.style.transform = "scale(0.6)";
        dragging.style.position = "relative";
        dragging.style.left = ``;
        dragging.style.top = ``;
        dragging = null;
    }
});

let ticking = false;
document.addEventListener('mousemove', (e) => {
    if (dragging && !ticking) {
        window.requestAnimationFrame(() => {
            dragging.style.left = `${e.clientX - dragOffsetX}px`;
            dragging.style.top = `${e.clientY - dragOffsetY}px`;
            ticking = false;
        });
        ticking = true;
    }
});

function updateScoreDisplay() {
    scoreDisplay.innerHTML = `<span style="color: red;">Red: ${redScore}</span> <span style="border-radius: 5px; border-right: 5px solid red; border-bottom: 3px solid red; padding: 6px; margin-left: 4px">${Math.floor(redTime / 60)}:${redTime % 60 < 10 ? 0 : ""}${redTime % 60}</span> <span style="border-radius: 5px; border-left: 5px solid blue; border-top: 3px solid blue; padding: 6px; margin-right: 4px">${Math.floor(blueTime / 60)}:${blueTime % 60 < 10 ? 0 : ""}${blueTime % 60}</span> <span style="color: blue;">Blue: ${blueScore}</span>`;
    turnIndicator.innerHTML = `Current Turn: <span style="color: ${players[player]};">${players[player].toUpperCase()}</span>`;
    turnIndicator.style.borderLeft = `5px solid ${players[player]}`;
}

updateScoreDisplay();

const elements1 = document.querySelector('.hex1').getElementsByClassName("a");
let i2 = 0;
Array.from(elements1).forEach((el, _) => {
    if (el.querySelector('.connecta')) {
        const div = document.createElement("div");
        const para = document.createElement("p");
        const node = document.createTextNode(`${connectScores[0][i2]}`);
        console.log("yes");

        para.appendChild(node);
        let translateX = "-8px";
        let translateY = "calc(10.1vh + 10vw)";

        para.style.position = "absolute";
        para.style.left = `0px`
        para.style.top = `calc(-2.6009vh - 1.0425vw)`
        para.style.transform = `translateX(${translateX}) translateY(${translateY}) rotate(-${90 + 120*i2}deg)`;
        para.style.color = `rgba(220, 220, 255, 0.9)`;
        para.style.textShadow = "0 0 20px rgba(150, 150, 255, 0.6)";
        para.style.fontWeight = '500'
        para.style.fontSize = 'calc(1.51744vh + 0.353039vw)'

        div.appendChild(para);

        div.style.position = "absolute";
        div.style.transform = `rotate(${30}deg)`;

        el.appendChild(div.cloneNode(true));
        i2++;
    }
})

const elements2 = document.querySelector('.hex2').getElementsByClassName("a");
let i3 = 0;
Array.from(elements2).forEach((el, _) => {
    if (el.querySelector('.connectb')) {
        const div = document.createElement("div");
        const para = document.createElement("p");
        const node = document.createTextNode(`${connectScores[1][i3]}`);
        console.log("yes");

        para.appendChild(node);
        let translateX = "20px";
        let translateY = "calc(5.05vh + 5vw)";

        para.style.position = "absolute";
        para.style.left = `0px`
        para.style.top = `calc(-2.6009vh - 1.0425vw)`
        para.style.transform = `translateX(${translateX}) translateY(${translateY}) rotate(-${30 + 120 * i3}deg)`;
        para.style.color = `rgba(220, 220, 255, 0.9)`;
        para.style.textShadow = "0 0 20px rgba(150, 150, 255, 0.6)";
        para.style.fontWeight = '500'
        para.style.fontSize = 'calc(1.51744vh + 0.353039vw)'

        div.appendChild(para);

        div.style.position = "absolute";
        div.style.transform = `rotate(${30}deg)`;

        el.appendChild(div.cloneNode(true));
        i3++;
    }
})

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
            translateX = "calc(12.814vh + 12.534vw)";
            left = "calc(3.6vh + 3.53vw)"
        } else if (hexIndex === 1) {
            translateX = "calc(7.688vh + 7.52vw)";
            left = "calc(2.13vh + 2.08vw)"
        } else {
            translateX = "calc(3.844vh + 3.76vw)";
            left = "calc(1.75vh + 1.711vw)"
        }

        para.style.position = "absolute";
        para.style.left = `${left}`
        para.style.top = `calc(-2.6009vh - 1.0425vw)`
        para.style.transform = `translateX(${translateX}) rotate(-${60 * i + 330}deg)`;
        para.style.color = `rgba(220, 220, 255, 0.9)`;
        para.style.textShadow = "0 0 20px rgba(150, 150, 255, 0.6)";
        para.style.fontWeight = '500'
        para.style.fontSize = 'calc(1.51744vh + 0.353039vw)'

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

        if (!neighbours[circleKey]) neighbours[circleKey] = [`${hexIndex + 1}-${(sideIndex + 5) % 6}`, `${hexIndex + 1}-${(sideIndex + 1) % 6}`];
        else {
            neighbours[circleKey].push(`${hexIndex + 1}-${(sideIndex + 5) % 6}`);
            neighbours[circleKey].push(`${hexIndex + 1}-${(sideIndex + 1) % 6}`);
        }
        const radialneighbours = a.querySelector('.connecta, .connectb')

        if (radialneighbours) {
            const innerKey = `${hexIndex + 2}-${sideIndex}`
            neighbours[circleKey].push(innerKey)
            if (!neighbours[innerKey]) neighbours[innerKey] = [];
            neighbours[innerKey].push(circleKey);
        }
    })
})

console.log(neighbours);

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
let unlocked = 0;
let inner = 0;

const completionCheck = () => {
    let sum = 0;     

    for (const titan of redTitans) {
        if (titan[0] == "3") {
            sum++;
        }
    }
    for (const titan of blueTitans) {
        if (titan[0] == "3") {
            sum++;          
        }
    }

    redTime = 0;

    if (sum >= 6 || redTime == 0 || blueTime == 0) {
        let gameOver = document.createElement("div");
        gameOver.style.position = "absolute";
        gameOver.style.background = "rgba(0, 0, 0, 0.6)"
        gameOver.style.height = "100vh";
        gameOver.style.width = "100vw";
        gameOver.style.zIndex = "9998";
        gameOver.style.display = "flex";
        gameOver.style.justifyContent = "center";
        gameOver.style.alignItems = "center";

        let gameBox = document.createElement("div");
        gameBox.classList.add("gamebox");

        gameBox.innerHTML =`
        <div style="display: flex; width: 100%; flex-direction: column; align-items: center">
            <span class='gameboxtext ${(blueTime == 0 || (redTime && blueTime && redScore > blueScore)) ? "red1" : (redTime == 0 || (redTime && blueTime && redScore < blueScore)) ? "blue1" : ""}'>${(blueTime == 0 || (redTime && blueTime && redScore > blueScore)) ? "Red Wins!" : (redTime == 0 || (redTime && blueTime && redScore < blueScore)) ? "Blue Wins!" : "Draw!"}</span>
            <span class='roasttext'> "${(blueTime == 0 || (redTime && blueTime && redScore > blueScore)) ? blueRoasts[Math.floor(10 * Math.random())] : (redTime == 0 || (redTime && blueTime && redScore < blueScore)) ? redRoasts[Math.floor(7 * Math.random())] : ""}" </span>
        </div>
        <div style="display: flex; width: 100%; margin-top: 15%; justify-content: space-around">
            <div class="${(blueTime == 0 || (redTime && blueTime && redScore > blueScore)) ? "animateRedRight" : (redTime == 0 || (redTime && blueTime && redScore < blueScore)) ? "animateRedLeft" : ""}" style="background: radial-gradient(circle, #8f5353, rgb(255, 0, 0)); width: calc(1.5vh + 3vw); height: calc(1.5vh + 3vw); border-radius: 50%; border: calc(0.75vh + 0.3vw) solid rgba(180, 180, 200, 0.8);"></div>
            <div class="${(blueTime == 0 || (redTime && blueTime && redScore > blueScore)) ? "animateBlueRight" : (redTime == 0 || (redTime && blueTime && redScore < blueScore)) ? "animateBlueLeft" : ""}" style="background: radial-gradient(circle, #535b8f, rgb(0, 0, 255)); width: calc(1.5vh + 3vw); height: calc(1.5vh + 3vw); border-radius: 50%; border: calc(0.75vh + 0.3vw) solid rgba(180, 180, 200, 0.8);"></div>
        </div>
        <div style="padding: 30px; width: 100%; display: flex; gap: 10vw; justify-content: center">
            <button onclick="location.href='menu.html'" class="gameBtn">
                <img src="menu.svg" alt="Menu" width="60" height="60"/>
            </button>
            <button onclick="restart_click()" class="gameBtn">
                <img src="restart.svg" alt="Restart" width="60" height="60"/>
            </button>
        </div>
        `;

        gameOver.appendChild(gameBox)

        document.body.appendChild(gameOver);
    }
}

const restart_click =  () => {
    const overlay = document.getElementById("black-overlay");
    overlay.style.opacity = 1;
    overlay.style.pointerEvents = "all";

    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

const calcScore = () => {
    let visitedPairs = new Set();
    
    const getScore = (redTitan) => {
        let [i, j] = redTitan.split("-").map(Number);
    return hexScores[i - 1][j];
    }

    redScore = 0;
    blueScore = 0;

    for (const redTitan of redTitans) {
        for (let neighbour of neighbours[redTitan]) {
            if (redTitans.has(neighbour)) {
                if (redTitan[0] == neighbour[0]) {
                    let sorted = [redTitan, neighbour].sort();
                    let pair = sorted.join(" -> ");
                    if (!visitedPairs.has(pair)) {
                        visitedPairs.add(pair);
                        redScore += getScore(sorted[1][2] != '5' || sorted[0][2] != '0' ? sorted[1] : sorted[0]);
                    }
                }
            }
        }
    }

    for (const blueTitan of blueTitans) {
        for (let neighbour of neighbours[blueTitan]) {
            if (blueTitans.has(neighbour)) {
                if (blueTitan[0] == neighbour[0]) {
                    let sorted = [blueTitan, neighbour].sort();
                    let pair = sorted.join(" -> ");
                    if (!visitedPairs.has(pair)) {
                        visitedPairs.add(pair);
                        blueScore += getScore(sorted[1][2] != '5' || sorted[0][2] != '0' ? sorted[1] : sorted[0]);
                    }
                }
            }
        }
    }
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

const checkUnlocked = () => {
    if (unlocked) return;
    if (redTitans.size + blueTitans.size >= 6) unlocked = 1;
}

const checkInner = () => {
    if (inner || !unlocked) return;
    let sum = 0;

    for (const titan of redTitans) {
        if (titan[0] == "2") {
            sum++;
        }
    }
    for (const titan of blueTitans) {
        if (titan[0] == "2") {
            sum++;
        }
    }
    console.log(sum);
    console.log(redTitans);
    console.log(blueTitans);

    if (sum >= 6) {
        inner = 1;
    }
}

const updateTitans = (circle, selected) => {  
    selected.style.boxShadow = `0 0 15px rgba(255, 255, 255, 0.6)`;

    console.log(selected.getAttribute("key"))
    !player ? redTitans.delete(selected.getAttribute("key")) : blueTitans.delete(selected.getAttribute("key"));
    !player ? redTitans.add(circle.getAttribute("key")) : blueTitans.add(circle.getAttribute("key"));
}

console.log(window.innerHeight)
console.log(window.innerWidth)

Array.from(circles).forEach(circle => {
    circle.addEventListener("click", () => {
        if (!player ? redTitans.size < 4 : blueTitans.size < 4) {
            if (selected && !circle.id && !neighbours[selected.getAttribute("key")].includes(circle.getAttribute("key"))) {
                selected = null;
            }
            if (!circle.id && !selected) {
                if (circle.getAttribute("key")[0] == "1") {
                circle.id = players[player];
                player ? blueTitans.add(circle.getAttribute("key")) : redTitans.add(circle.getAttribute("key"));
                player = (player + 1) % 2;
                checkUnlocked();
                changeTime();
                calcScore();
                updateScoreDisplay();
                } else if (circle.getAttribute("key")[0] == "2") {
                    if (unlocked) {
                        circle.id = players[player];
                        player ? blueTitans.add(circle.getAttribute("key")) : redTitans.add(circle.getAttribute("key"));
                        player = (player + 1) % 2;
                        changeTime();
                        calcScore();
                        updateScoreDisplay();
                        if (redTitans.size + blueTitans.size == 8) {
                            toggleCircleCursor(true)
                        }
                    }
                } else {
                    if (inner) {
                        circle.id = players[player];
                        player ? blueTitans.add(circle.getAttribute("key")) : redTitans.add(circle.getAttribute("key"));
                        player = (player + 1) % 2;
                        changeTime();
                        calcScore();
                        updateScoreDisplay();
                        if (redTitans.size + blueTitans.size == 8) {
                            toggleCircleCursor(true)
                        }
                    }
                }
            }
        }
            if (circle.id == players[player]) {
                if (selected == circle == circle) {
                    selected.style.boxShadow = `0 0 15px rgba(255, 255, 255, 0.6)`;
                    selected = null
                } else {
                    selected ? selected.style.boxShadow = `0 0 15px rgba(255, 255, 255, 0.6)` : "" ;
                    selected = circle;
                    selected.style.boxShadow = `0 0 20px ${players[player]}`;

                    console.log(selected.getAttribute("key"));
                }
            } else {
                if (selected && neighbours[selected.getAttribute("key")].includes(circle.getAttribute("key")) && !circle.id) {
                    if (circle.getAttribute("key")[0] == "1") {
                        circle.id = players[player];
                        selected.id = "";
                        updateTitans(circle, selected);
                        selected = null;
                        player = (player + 1) % 2;
                        changeTime();
                        toggleCircleCursor(true)
                        updateScoreDisplay();
                        calcScore();
                        completionCheck();
                    } else if (circle.getAttribute("key")[0] == "2") {
                        if (unlocked) {
                            circle.id = players[player];
                            selected.id = "";
                            updateTitans(circle, selected);
                            selected = null;
                            player = (player + 1) % 2;
                            changeTime();
                            toggleCircleCursor(true)
                            updateScoreDisplay();
                            calcScore();
                            completionCheck();
                        }
                    } else {
                        if (inner) {
                            circle.id = players[player];
                            selected.id = "";
                            updateTitans(circle, selected);
                            selected = null;
                            player = (player + 1) % 2;
                            changeTime();
                            toggleCircleCursor(true)
                            updateScoreDisplay();
                            calcScore();
                            completionCheck();
                        }
                    }

                }
            }
        checkInner();
        numOfPieces();
    })
});

