//pacman
class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 0;
        this.nextDirection = 4;
        this.frameCount = 7;
        this.currentFrame = 1;
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }
    
    //para que pueda hacer el tunel
    manejoTunel(){
        if (this.getMapY() !== TUNEL) return;

        if (this.x < -this.width) {
            this.x = map[0].length * oneBlockSize;
        }

        if (this.x > map[0].length * oneBlockSize) {
            this.x = -this.width;
        }

    }

    //logica de movimiento
    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        this.manejoTunel();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }

    //comer la puntuación, depende del numero que tiene la casilla del mapa
    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i) {
                    map[i][j] = 0;
                    score += 10;
                    //console.log("Puntos", score);
                }
                if (map[i][j] == 3 && this.getMapX() == j && this.getMapY() == i) {
                    map[i][j] = 0;
                    score += 50;
                }
            }
        }
    }

    //cambio de direcciones
    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Right
                this.x -= this.speed;
                break;
            case DIRECTION_UP: // Up
                this.y += this.speed;
                break;
            case DIRECTION_LEFT: // Left
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM: // Bottom
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

    //si toca paredes
    checkCollisions() {
        let isCollided = false;
        if (map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] == 1 || 
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize)] == 1 || 
            map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize + 0.9999)] == 1 || 
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize + 0.9999)] == 1) {
            isCollided = true;
        }
        return isCollided;
    }

    //si toca fantasmas
    checkGhostCollision(ghosts) {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (ghost.getMapX() == this.getMapX() && ghost.getMapY() == this.getMapY()) {
                return true;
            }
        }
        return false;
    }

    //determina si se puede cambiar la dirección en la posición
    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
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
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    //para que pacman cambie de sprite
    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    //camo se pinta segun la direccion
    draw() {
        if(!graficos) return;
        let spriteIndex = 0;
        let frame = (this.currentFrame - 1) % 2;
        switch (this.direction) 
        {
            case DIRECTION_RIGHT:
                spriteIndex = frame;
                break;
            case DIRECTION_LEFT:
                spriteIndex = 2 + frame;
                break;
            case DIRECTION_UP:
                spriteIndex = 4 + frame;
                break;
            case DIRECTION_BOTTOM:
                spriteIndex = 6 + frame;
                break;
        }

        pacmanList[spriteIndex].dibuja(canvasContext, this.x, this.y);
    }
}
