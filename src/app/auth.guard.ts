import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if authToken exists in localStorage
  if (localStorage.getItem('user')) {
    // If token exists, allow navigation
    if(state.url === '/test'){
      if(localStorage.getItem('user') === 'reddyvinaykumar497@gmail.com'){
        return true;
      } else{
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
