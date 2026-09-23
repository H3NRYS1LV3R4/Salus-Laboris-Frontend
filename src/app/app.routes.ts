import { Routes } from '@angular/router';
import { authGuard, guestGuard, permissionGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  {
    path: '', canActivate: [authGuard],
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'personas', canActivate: [permissionGuard], data: { permission: '/personas' }, loadComponent: () => import('./features/personas/personas.component').then(m => m.PersonasComponent) },
      { path: 'usuarios', canActivate: [permissionGuard], data: { permission: '/usuarios' }, loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
      { path: 'roles', canActivate: [permissionGuard], data: { permission: '/roles' }, loadComponent: () => import('./features/roles/roles.component').then(m => m.RolesComponent) },
      { path: 'paginas', canActivate: [permissionGuard], data: { permission: '/paginas' }, loadComponent: () => import('./features/paginas/paginas.component').then(m => m.PaginasComponent) },
      { path: 'accesos', canActivate: [permissionGuard], data: { permission: '/accesos' }, loadComponent: () => import('./features/accesos/accesos.component').then(m => m.AccesosComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' }
];
