import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-strange',
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './strange.component.html',
  styleUrl: './strange.component.css'
})
export class StrangeComponent {

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  isButtonVisible = true;
  showMessage = false;
  buttonClickTime: string = '';

  // Toggle button visibility
  toggleVisibility() {
    this.isButtonVisible = !this.isButtonVisible;
    this.showMessage = !this.showMessage;
    this.buttonClickTime = new Date().toLocaleTimeString();
  }

  // Randomly get a style for each item
  getRandomStyle() {
    const positions = [
      'absolute', 'relative', 'fixed', 'sticky', 'inherit'
    ];
    const colors = ['red', 'green', 'blue', 'orange', 'purple'];
    return {
      position: positions[Math.floor(Math.random() * positions.length)],
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      transition: 'all 1s ease-in-out'
    };
  }

  // Trigger behavior on mouse hover
  onHover() {
    if (Math.random() < 0.5) {
      this.items.push(`New Item ${this.items.length + 1}`);
    }
  }
}

