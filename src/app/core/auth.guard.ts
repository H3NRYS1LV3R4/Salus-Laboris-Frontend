import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard:CanActivateFn = () => inject(AuthService).authenticated() ? true : inject(Router).createUrlTree(['/login']);
export const guestGuard:CanActivateFn = () => inject(AuthService).authenticated() ? inject(Router).createUrlTree(['/dashboard']) : true;
export const permissionGuard:CanActivateFn = (route:ActivatedRouteSnapshot) => inject(AuthService).hasPage(route.data['permission'] as string) ? true : inject(Router).createUrlTree(['/dashboard']);
