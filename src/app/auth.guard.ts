import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if authToken exists in localStorage
  if (localStorage.getItem('user')) {
    // If token exists, allow navigation
    return true;
  } else {
    // If token doesn't exist, redirect to login page
    router.navigate(['/login']);
    return false;
  }
};
