import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
  setSessionData(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  // Get data from session storage
  getSessionData(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  // Remove data from session storage
  removeSessionData(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Clear all session data
  clearSessionData(): void {
    sessionStorage.clear();
  }
}
