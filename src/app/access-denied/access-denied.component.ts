import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css'
})
export class AccessDeniedComponent implements OnInit {

  constructor(private router:Router){
    
  }
  ngOnInit(): void {
    // Wait for the view to be initialized and then add the 'show' class for animation
    setTimeout(() => {
      const container = document.querySelector('.access-denied-container');
      if (container) {
        container.classList.add('show');
      }
    }, 1000);
  }

  goHome() {
    this.router.navigate(['/']); // You can change '/' to any other route you prefer
  }
  goRegister(){
    localStorage.clear();
    this.router.navigate(['/register']); 
  }

}
