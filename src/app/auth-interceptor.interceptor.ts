import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SessionService } from './session/session.service';
import { Router } from '@angular/router';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(SessionService);
  const router = inject(Router);
  const authToken = authService.getSessionData("Token");
  console.log("Interceptor invoked for URL:", req.url);

  if (authToken && (!req.url.startsWith("https://selenium") && !req.url.startsWith("https://maps") && !req.url.startsWith("https://api.perplexity.ai"))) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && (error.status === 401||error.status === 403) && router.url !== '/login-faceid' && !router.url.includes('getTheme/')) {
        localStorage.clear();
        authService.clearSessionData();
        router.navigate(['login']);
      }
      return throwError(() => error);
    })
  );
};
