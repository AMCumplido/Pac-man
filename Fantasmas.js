//Fantasmas
class Ghost {
    constructor(x, y, width, height, speed, range, name) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.range = range;
        this.name = name;
        this.randomTargetIndex = parseInt(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        this.tiempoUltimaDireccion = 0;
        this.tiempoCambioDireccion = 10000;
    }

    isInRange() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        return Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range;
    }

    changeRandomDirection() {
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    manejoTunel(){
        if (this.getMapY() !== TUNEL) return;

        if (this.x < -this.width) {
            this.x = map[0].length * oneBlockSize;
        }

        if (this.x > map[0].length * oneBlockSize) {
            this.x = -this.width;
        }

    }

    moveProcess() {
        if(this.name === "Blinky"){
            this.target = pacman;
        }
        else{
            if (this.isInRange()) {
                this.target = pacman;
            } else {
                this.target = randomTargetsForGhosts[this.randomTargetIndex];
            }
        } 
        this.changeDirectionIfPossible();
        this.moveForwards();
        this.manejoTunel();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case 4: // Right
                this.x -= this.speed;
                break;
            case 3: // Up
                this.y += this.speed;
                break;
            case 2: // Left
                this.x += this.speed;
                break;
            case 1: // Bottom
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Right
                this.x += this.speed;
                break;
            case DIRECTION_UP: // Up
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT: // Left
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM: // Bottom
                this.y += this.speed;
                break;
        }
    }

    checkCollisions() {
        const left = Math.floor(this.x / oneBlockSize);
        const right = Math.floor((this.x + this.width - 1) / oneBlockSize);
        const top = Math.floor(this.y / oneBlockSize);
        const bottom = Math.floor((this.y + this.height - 1) / oneBlockSize);
        return map[top][left] == 1 || map[top][right] == 1 || map[bottom][left] == 1 || map[bottom][right] == 1;

    }

    changeDirectionIfPossible() {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(map, parseInt(this.target.x / oneBlockSize), parseInt(this.target.y / oneBlockSize));
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (this.getMapY() != this.getMapYRightSide() && (this.direction == DIRECTION_LEFT || this.direction == DIRECTION_RIGHT)) {
            this.direction = DIRECTION_UP;
        }
        if (this.getMapX() != this.getMapXRightSide() && this.direction == DIRECTION_UP) {
            this.direction = DIRECTION_LEFT;
        }
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
        //console.log(this.direction);
    }

    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return DIRECTION_BOTTOM; // direction
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (poped.x - 1 >= 0 && poped.x - 1 < numOfColumns && mp[poped.y][poped.x - 1] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (poped.x + 1 >= 0 && poped.x + 1 < numOfColumns && mp[poped.y][poped.x + 1] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (poped.y - 1 >= 0 && poped.y - 1 < numOfRows && mp[poped.y - 1][poped.x] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (poped.y + 1 >= 0 && poped.y + 1 < numOfRows && mp[poped.y + 1][poped.x] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    getMapX() {
        let mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    }

    getMapY() {
        let mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    }

    getMapXRightSide() {
        return Math.floor((this.x + this.width - 1) / oneBlockSize);
    }

    getMapYRightSide() {
        return Math.floor((this.y + this.height - 1) / oneBlockSize);
    }


    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        let base = 0;

        switch (this.direction) {
            case DIRECTION_RIGHT: base = 0; break;
            case DIRECTION_LEFT: base = 2; break;
            case DIRECTION_UP: base = 4; break;
            case DIRECTION_BOTTOM: base = 6; break;
        }

        let frame = Math.floor(Date.now() / 200) % 2;
        let spriteIndex = base + frame;

        if(this.name === "Blinky"){
            spriteIndex += 0;
        }
        else if(this.name === "Pinky"){
            spriteIndex += 8;
        }
        else if(this.name === "Inky"){
            spriteIndex += 16;
        }
        else if(this.name === "Clyde"){
            spriteIndex += 24;
        }

        fantasmasList[spriteIndex].dibuja(canvasContext, this.x, this.y);
        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(this.x + oneBlockSize/2, this.y + oneBlockSize/2, this.range * oneBlockSize, 0, 2*Math.PI);
        canvasContext.stroke();
    }

}

function updateGhosts(deltatime) {
    for (let i = 0; i < ghosts.length; i++) {
        let ghost = ghosts[i];
        ghost.tiempoUltimaDireccion += deltatime;
        if(ghost.tiempoUltimaDireccion >= ghost.tiempoCambioDireccion){
            ghost.changeRandomDirection();
            ghost.tiempoUltimaDireccion = 0;
        }
        ghosts[i].moveProcess();
    }
};

function drawGhosts() {
    if(!graficos) return;
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};
