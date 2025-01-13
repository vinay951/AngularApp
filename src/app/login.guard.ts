import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if authToken exists in localStorage
  if (localStorage.getItem('user')) {
    // If token exists, allow navigation
    router.navigate(['/home']);
    return false;
  } else {
    // If token doesn't exist, redirect to login page
    return true;
  }
};
