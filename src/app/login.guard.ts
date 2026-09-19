import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from './session/session.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  sessionService.setSessionData("routed",state.url);
  const exp = sessionService.getSessionData("expire");
  var timeExpired = false;
  try {
    const expirationTime = Number(sessionService.getSessionData("expire")) * 1000; // exp is in seconds, convert to milliseconds
    timeExpired =  !(Date.now() > expirationTime); // If current time is greater than expiration time, it's expired
  } catch (error) {
    timeExpired = true;
  }

  // Check if authToken exists in sessionStorage
  if (sessionStorage.getItem('user') && timeExpired) {
    // If token exists, allow navigation
    router.navigate(['/home']);
    return false;
  } else {
    // If token doesn't exist, redirect to login page
    return true;
  }
};
