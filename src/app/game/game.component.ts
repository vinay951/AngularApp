import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule],
})
export class GameComponent {
  // Simple number guessing game logic
  randomNumber: number = Math.floor(Math.random() * 100) + 1;
  guess: number | null = null;
  message: string = '';
  attempts: number = 0;

  checkGuess() {
    if (this.guess === null) {
      this.message = 'Please enter a number!';
      return;
    }
    this.attempts++;
    if (this.guess === this.randomNumber) {
      this.message = `Congratulations! You guessed it in ${this.attempts} attempts.`;
    } else if (this.guess < this.randomNumber) {
      this.message = 'Try higher!';
    } else {
      this.message = 'Try lower!';
    }
  }

  resetGame() {
    this.randomNumber = Math.floor(Math.random() * 100) + 1;
    this.guess = null;
    this.message = '';
    this.attempts = 0;
  }

  // Car Game Implementation
  carPosition: number = 10; // X position (column)
  carLaneCount: number = 20;
  carBoardHeight: number = 20;
  tileSize: number = 20; // Add this if not present for car game board sizing
  carObstacles: { x: number; y: number }[] = [];
  carGameOver: boolean = false;
  carScore: number = 0;
  carIntervalId: any;
  carKeyListener: any;
  carIsActive: boolean = false;

  startCarGame() {
    this.resetCarGame();
    this.carIsActive = true;
    this.carIntervalId = setInterval(() => this.moveCarGame(), 200);
    this.carKeyListener = this.handleCarKeyDown.bind(this);
    window.addEventListener('keydown', this.carKeyListener);
  }

  stopCarGame() {
    this.carIsActive = false;
    if (this.carIntervalId) clearInterval(this.carIntervalId);
    window.removeEventListener('keydown', this.carKeyListener);
  }

  resetCarGame() {
    this.carPosition = 10;
    this.carObstacles = [];
    this.carGameOver = false;
    this.carScore = 0;
    if (this.carIntervalId) clearInterval(this.carIntervalId);
    if (this.carKeyListener) window.removeEventListener('keydown', this.carKeyListener);
  }

  moveCarGame() {
    if (this.carGameOver || !this.carIsActive) return;
    // Move obstacles down
    this.carObstacles = this.carObstacles.map(obs => ({ x: obs.x, y: obs.y + 1 }));
    // Remove obstacles that are out of the board
    this.carObstacles = this.carObstacles.filter(obs => obs.y < this.carBoardHeight);
    // Add new obstacle randomly
    if (Math.random() < 0.3) {
      this.carObstacles.push({ x: Math.floor(Math.random() * this.carLaneCount), y: 0 });
    }
    // Check collision
    if (this.carObstacles.some(obs => obs.x === this.carPosition && obs.y === this.carBoardHeight - 1)) {
      this.carGameOver = true;
      this.carIsActive = false;
      if (this.carIntervalId) clearInterval(this.carIntervalId);
      window.removeEventListener('keydown', this.carKeyListener);
      return;
    }
    this.carScore++;
  }

  handleCarKeyDown(event: KeyboardEvent) {
    if (!this.carIsActive || this.carGameOver) return;
    if (event.key === 'ArrowLeft' && this.carPosition > 0) {
      this.carPosition--;
    } else if (event.key === 'ArrowRight' && this.carPosition < this.carLaneCount - 1) {
      this.carPosition++;
    }
  }

  getCarTileClass(x: number, y: number): string {
    if (x === this.carPosition && y === this.carBoardHeight - 1) return 'car';
    if (this.carObstacles.some(obs => obs.x === x && obs.y === y)) return 'obstacle';
    return '';
  }
}
