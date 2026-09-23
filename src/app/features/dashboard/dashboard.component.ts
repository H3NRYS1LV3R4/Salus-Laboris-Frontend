import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({selector:'app-dashboard',imports:[RouterLink],templateUrl:'./dashboard.component.html',styleUrl:'./dashboard.component.scss'})
export class DashboardComponent { readonly auth=inject(AuthService); }
