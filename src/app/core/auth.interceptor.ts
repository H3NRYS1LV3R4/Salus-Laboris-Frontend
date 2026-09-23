import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor:HttpInterceptorFn = (request,next) => {
  const auth=inject(AuthService); const token=auth.token();
  const secured=token ? request.clone({setHeaders:{Authorization:`Bearer ${token}`}}) : request;
  return next(secured).pipe(catchError((error:HttpErrorResponse) => {
    if (error.status===401 && !request.url.endsWith('/auth/login')) auth.logout();
    return throwError(() => error);
  }));
};
