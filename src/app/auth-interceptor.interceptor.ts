import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SessionService } from './session/session.service';
import { Router } from '@angular/router';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(SessionService);
  const router = inject(Router);
  const authToken = authService.getSessionData("Token");

  if (authToken && (!req.url.startsWith("https://selenium") && !req.url.startsWith("https://maps"))) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        router.navigate(['login']);
      }
      return throwError(() => error);
    })
  );
};
