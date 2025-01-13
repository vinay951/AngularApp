import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

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
