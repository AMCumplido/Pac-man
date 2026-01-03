const canvas = document.getElementById("lienzo");
const canvasContext = canvas.getContext("2d");

function createRect (x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
const TUNEL = 10;
let lives = 3;

// Variables del juego
let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let numGhosts = 1;
let ghosts = new Array(numGhosts);
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let tiempoActual = performance.now();

// 1 = pared
// 0 = no pared
// 2 = comida
// 3 = super
// 21 columnas
// 23 filas
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 3, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 0, 1, 0, 0, 0, 1, 0, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 3, 2, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 2, 3, 1],
    [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize,},
];

function createNewPacman(){
    pacman = new Pacman(oneBlockSize*10, oneBlockSize*17, oneBlockSize, oneBlockSize, oneBlockSize / 5);
};

function gameLoop() {
    let ahora = performance.now();
    let deltatime = ahora - tiempoActual;
    tiempoActual = ahora;
    draw();
    update(deltatime);
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

function restartPacmanAndGhosts() {
    createNewPacman();
    createGhosts();
};

function onGhostCollision() {
    console.log("tocado");
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
        gameOver();
    }
};

function update(deltatime) {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts(deltatime);
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
    if(score === 1880){
        win();
    }
};

function drawWin(){
    if(!graficos) return;
    canvasContext.font = "30px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("WIN!", 180, 230);
}

function win(){
    drawWin();
    clearInterval(gameInterval);
}

function gameOver(){
    drawGameOver();
    clearInterval(gameInterval);
}

function drawGameOver(){
    if(!graficos) return;
    canvasContext.font = "23px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("GAME OVER", 140, 230);
}

function drawFoods() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(j * oneBlockSize + oneBlockSize / 3, i * oneBlockSize + oneBlockSize / 3, oneBlockSize / 5, oneBlockSize / 5, "#FEB897");
            }
            if(map[i][j] == 3){
                createRect(j * oneBlockSize + oneBlockSize / 3, i * oneBlockSize + oneBlockSize / 3, oneBlockSize / 3, oneBlockSize / 3, "#FEB897");
            }
        }
    }
};

function drawLives() {
    if(!graficos) return;
    canvasContext.font = "23px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 260, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        pacmanList[1].dibuja(canvasContext, 330 + i * oneBlockSize, oneBlockSize * map.length + 8);
    }
};

function drawScore() {
    canvasContext.font = "23px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Score: " + score, 0, oneBlockSize * (map.length + 1));
};

function draw() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawLives();
};

function drawWalls() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(j * oneBlockSize, i * oneBlockSize, oneBlockSize, oneBlockSize, "#342DCA");
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(j * oneBlockSize, i * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
                }
            }
        }
    }
};

function createGhosts() {
    ghosts = [];
    let Blinky = new Ghost(9 * oneBlockSize, 10 * oneBlockSize, oneBlockSize, oneBlockSize, pacman.speed / 2, 6, "Blinky");
    ghosts.push(Blinky);
    let Pinky = new Ghost(10 * oneBlockSize, 10 * oneBlockSize, oneBlockSize, oneBlockSize, pacman.speed / 2, 7, "Pinky");
    ghosts.push(Pinky);
    let Inky = new Ghost(9 * oneBlockSize, 11 * oneBlockSize, oneBlockSize, oneBlockSize, pacman.speed / 2, 8, "Inky");
    ghosts.push(Inky);
    let Clyde = new Ghost(10 * oneBlockSize, 11 * oneBlockSize, oneBlockSize, oneBlockSize, pacman.speed / 2, 9, "Clyde");
    ghosts.push(Clyde);
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", teclado, false);

function teclado (t){
    if(pacman){
        switch(t.keyCode) {
            case 37: // flecha izquierda
            case 65: // A
                pacman.nextDirection = DIRECTION_LEFT;
                break;
            case 38: // flecha arriba
            case 87: // W
                pacman.nextDirection = DIRECTION_UP;
                break;
            case 39: // flecha derecha
            case 68: // D
                pacman.nextDirection = DIRECTION_RIGHT;
                break;
            case 40: // flecha abajo
            case 83: // S
                pacman.nextDirection = DIRECTION_BOTTOM;
                break;
        }
    }
}
 
