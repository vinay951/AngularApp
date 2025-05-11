import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./footer/footer.component";
import { SessionService } from './session/session.service';
import { interval } from 'rxjs';
import { ChatbotComponent } from "./chatbot/chatbot.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule, FooterComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor( private router: Router,private session:SessionService){

  }

  isOfflineModalOpen = false;

  ngOnInit(): void {
    // interval(1000).pipe().subscribe(() => {
    //   this.checkTokenExpiration();
    // });
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }

    window.addEventListener('offline', () => {
      this.isOfflineModalOpen = true;
    });

    window.addEventListener('online', () => {
      this.isOfflineModalOpen = false;
    });
  }

  closeOfflineModal() {
    this.isOfflineModalOpen = false;
  }

  title = 'angularApp';
  checkmethod():boolean{
    if(this.router.url==='/login' || this.router.url==='/register' ||  this.router.url==='/otp' || this.router.url==='/forgot' || this.router.url==='/accessDenied'){
      return false;
    } return true;
  }

  // Method to clear session and redirect to login
  logout(): void {
    this.session.clearSessionData(); // or localStorage.removeItem('token')
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  isTokenExpired(): boolean {
    const exp = this.session.getSessionData("expire");
    if (!exp) return true; // If no token is found, consider it expired
    try {
      const expirationTime = Number(this.session.getSessionData("expire")) * 1000; // exp is in seconds, convert to milliseconds
      return Date.now() > expirationTime; // If current time is greater than expiration time, it's expired
    } catch (error) {
      return true; // If token decoding fails, consider it expired
    }
  }

  // Method to check token expiration and handle session
  checkTokenExpiration(): void {
    if (this.isTokenExpired() && (this.router.url != '/login' && this.router.url != '/register' && this.router.url != '/otp' && this.router.url!='/forgot')) {
      this.logout();  // Clear session and navigate to login page
    }
  }
}