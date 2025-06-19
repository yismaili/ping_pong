"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongGame = void 0;
class PongGame {
    constructor() {
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.paddleWidth = 10;
        this.paddleHeight = 80;
        this.paddleSpeed = 10;
        this.ballRadius = 10;
        this.ballSpeedX = 10;
        this.ballSpeedY = 10;
        this.leftPaddle = this.canvasHeight / 2 - this.paddleHeight / 2;
        this.rightPaddle = this.canvasHeight / 2 - this.paddleHeight / 2;
        this.leftPlayerScore = 0;
        this.rightPlayerScore = 0;
        this.winnerPlayer = null;
        this.ballX = this.canvasWidth / 2;
        this.ballY = this.canvasHeight / 2;
        this.upPressed = false;
        this.downPressed = false;
        this.wPressed = false;
        this.sPressed = false;
        this.intervalId = null;
        this.isRunning = false;
    }
    async updateGame() {
        if (this.upPressed && this.rightPaddle > 0) {
            this.rightPaddle -= this.paddleSpeed;
        }
        else if (this.downPressed && this.rightPaddle < this.canvasHeight - this.paddleHeight) {
            this.rightPaddle += this.paddleSpeed;
        }
        if (this.wPressed && this.leftPaddle > 0) {
            this.leftPaddle -= this.paddleSpeed;
        }
        else if (this.sPressed && this.leftPaddle < this.canvasHeight - this.paddleHeight) {
            this.leftPaddle += this.paddleSpeed;
        }
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;
        if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvasHeight) {
            this.ballSpeedY *= -1;
        }
        if (((this.ballY + this.ballRadius) > this.leftPaddle && (this.ballX - this.ballRadius) < this.paddleWidth && (this.ballY < this.leftPaddle))
            || ((this.ballY - this.ballRadius) < (this.leftPaddle + this.paddleHeight) && (this.ballX - this.ballRadius) < this.paddleWidth && (this.ballY > (this.leftPaddle + this.paddleHeight)))) {
            this.ballSpeedX *= -1;
            this.ballSpeedY *= -1;
        }
        else if (this.ballY > this.leftPaddle - this.ballRadius &&
            this.ballY < this.leftPaddle + this.paddleHeight + this.ballRadius &&
            this.ballX - this.ballRadius < this.paddleWidth) {
            this.ballSpeedX *= -1;
        }
        if (((this.ballY + this.ballRadius) > this.rightPaddle && (this.ballX + this.ballRadius) > (this.canvasWidth - this.paddleWidth) && (this.ballY < this.rightPaddle))
            || ((this.ballY - this.ballRadius) < (this.rightPaddle + this.paddleHeight) && (this.ballX + this.ballRadius) > (this.canvasWidth - this.paddleWidth) && (this.ballY > (this.rightPaddle + this.paddleHeight)))) {
            this.ballSpeedX *= -1;
            this.ballSpeedY *= -1;
        }
        else if (this.ballY > this.rightPaddle - this.ballRadius &&
            this.ballY < this.rightPaddle + this.paddleHeight + this.ballRadius &&
            this.ballX + this.ballRadius > this.canvasWidth - this.paddleWidth) {
            this.ballSpeedX *= -1;
        }
        if (this.ballX <= 0) {
            this.rightPlayerScore++;
            this.resetGame();
        }
        else if (this.ballX >= this.canvasWidth) {
            this.leftPlayerScore++;
            this.resetGame();
        }
        if (this.leftPlayerScore === 5) {
            this.winnerPlayer = 'left';
            this.resetGame();
            this.isGameOver();
            this.ballX = this.canvasWidth / 2;
            this.ballY = this.canvasHeight / 2;
            this.leftPaddle = this.canvasHeight / 2 - this.paddleHeight / 2;
            this.rightPaddle = this.canvasHeight / 2 - this.paddleHeight / 2;
        }
        else if (this.rightPlayerScore === 5) {
            this.winnerPlayer = 'right';
            this.resetGame();
            this.isGameOver();
            this.ballX = this.canvasWidth / 2;
            this.ballY = this.canvasHeight / 2;
            this.leftPaddle = this.canvasHeight / 2 - this.paddleHeight / 2;
            this.rightPaddle = this.canvasHeight / 2 - this.paddleHeight / 2;
        }
    }
    resetGame() {
        this.ballX = this.canvasWidth / 2;
        this.ballY = this.canvasHeight / 2;
        this.ballSpeedX = -this.ballSpeedX;
        this.ballSpeedY = Math.random() * 2 + this.ballSpeedY;
    }
    getBallX() {
        return this.ballX;
    }
    getBallY() {
        return this.ballY;
    }
    getLeftPaddle() {
        return this.leftPaddle;
    }
    getRightPaddle() {
        return this.rightPaddle;
    }
    setUpPressed(up) {
        this.upPressed = up;
    }
    setDownPressed(down) {
        this.downPressed = down;
    }
    setWPressed(w) {
        this.wPressed = w;
    }
    setSPressed(s) {
        this.sPressed = s;
    }
    getlLeftPlayerScore() {
        return this.leftPlayerScore;
    }
    getrRightPlayerScore() {
        return this.rightPlayerScore;
    }
    getStatus() {
        return this.isRunning;
    }
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.intervalId = setInterval(() => {
                this.updateGame();
            }, 1000 / 60);
        }
    }
    isGameOver() {
        if (this.isRunning) {
            clearInterval(this.intervalId);
            this.isRunning = false;
            return true;
        }
        return false;
    }
}
exports.PongGame = PongGame;
//# sourceMappingURL=pong-game.js.map