import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarObstacle {
  lane: number;
  row: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GameComponent {
  carPosition = 1;
  carLaneCount = 4;
  carBoardHeight = 12;
  tileSize = 42;
  carObstacles: CarObstacle[] = [];
  carGameOver = false;
  carScore = 0;
  carBestScore = 0;
  carIntervalId: any = null;
  carKeyListener: any = null;
  carIsActive = false;
  isPaused = false;
  carSpeed = 240;
  gameStatus = 'Ready for the next run';

  startCarGame() {
    this.resetCarGame();
    this.carIsActive = true;
    this.isPaused = false;
    this.carSpeed = 240;
    this.gameStatus = 'Race live';
    this.carKeyListener = this.handleCarKeyDown.bind(this);
    window.addEventListener('keydown', this.carKeyListener);
    this.carIntervalId = setInterval(() => this.moveCarGame(), this.carSpeed);
  }

  togglePause() {
    if (!this.carIsActive || this.carGameOver) return;

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.gameStatus = 'Paused';
      if (this.carIntervalId) clearInterval(this.carIntervalId);
      return;
    }

    this.gameStatus = 'Race live';
    this.carIntervalId = setInterval(() => this.moveCarGame(), this.carSpeed);
  }

  stopCarGame() {
    this.carIsActive = false;
    this.isPaused = false;
    this.gameStatus = 'Ready for the next run';
    if (this.carIntervalId) clearInterval(this.carIntervalId);
    if (this.carKeyListener) window.removeEventListener('keydown', this.carKeyListener);
  }

  resetCarGame() {
    this.carPosition = 1;
    this.carObstacles = [];
    this.carGameOver = false;
    this.carScore = 0;
    this.carIsActive = false;
    this.isPaused = false;
    this.gameStatus = 'Ready for the next run';

    if (this.carIntervalId) clearInterval(this.carIntervalId);
    if (this.carKeyListener) window.removeEventListener('keydown', this.carKeyListener);
    this.carKeyListener = null;
  }

  moveCarGame() {
    if (this.carGameOver || !this.carIsActive || this.isPaused) return;

    this.carObstacles = this.carObstacles.map((obs) => ({ ...obs, row: obs.row + 1 }));
    this.carObstacles = this.carObstacles.filter((obs) => obs.row < this.carBoardHeight + 2);

    if (Math.random() < 0.75) {
      const randomLane = Math.floor(Math.random() * this.carLaneCount);
      this.carObstacles.push({ lane: randomLane, row: 0 });
    }

    const collision = this.carObstacles.some(
      (obs) => obs.lane === this.carPosition && obs.row >= this.carBoardHeight - 2
    );

    if (collision) {
      this.carGameOver = true;
      this.carIsActive = false;
      this.carBestScore = Math.max(this.carBestScore, this.carScore);
      this.gameStatus = 'Crash! Try another run';
      if (this.carIntervalId) clearInterval(this.carIntervalId);
      if (this.carKeyListener) window.removeEventListener('keydown', this.carKeyListener);
      return;
    }

    this.carScore += 10;

    if (this.carScore > 0 && this.carScore % 120 === 0) {
      this.carSpeed = Math.max(120, this.carSpeed - 18);
      clearInterval(this.carIntervalId);
      this.carIntervalId = setInterval(() => this.moveCarGame(), this.carSpeed);
    }
  }

  moveCarLeft() {
    if (!this.carIsActive || this.carGameOver || this.isPaused) return;
    this.carPosition = Math.max(0, this.carPosition - 1);
  }

  moveCarRight() {
    if (!this.carIsActive || this.carGameOver || this.isPaused) return;
    this.carPosition = Math.min(this.carLaneCount - 1, this.carPosition + 1);
  }

  handleCarKeyDown(event: KeyboardEvent) {
    if (!this.carIsActive || this.carGameOver || this.isPaused) return;

    const isLeft = event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A';
    const isRight = event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D';

    if (isLeft) {
      this.moveCarLeft();
    } else if (isRight) {
      this.moveCarRight();
    }
  }

  getCarTileClass(x: number, y: number): string {
    const playerRow = this.carBoardHeight - 1;
    const obstacleMatch = this.carObstacles.some((obs) => obs.lane === x && obs.row === y);

    if (x === this.carPosition && y === playerRow) {
      return 'car';
    }

    if (obstacleMatch) {
      return 'obstacle';
    }

    return 'road';
  }
}
