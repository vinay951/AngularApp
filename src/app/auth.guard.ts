import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from './session/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  sessionService.setSessionData("routed",state.url);
  const exp = sessionService.getSessionData("expire");
  var timeExpired = false;
  try {
    const expirationTime = Number(sessionService.getSessionData("expire")) * 1000; // exp is in seconds, convert to milliseconds
    timeExpired =  !(Date.now() > expirationTime); // If current time is greater than expiration time, it's expired
    if(!timeExpired){
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    return false;
  }
  console.log(timeExpired)
  // Check if authToken exists in localStorage
  if (localStorage.getItem('user')) {
    if(state.url === '/test' || state.url === '/profile'){
      if(localStorage.getItem('user')?.startsWith("User-")){
        router.navigate(['/accessDenied']);
        return false;
      }
    }
    return true;
  } else {
    // If token doesn't exist, redirect to login page
    router.navigate(['/login']);
    return false;
  }
};
