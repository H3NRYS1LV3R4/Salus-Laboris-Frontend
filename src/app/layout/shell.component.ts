import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({selector:'app-shell',imports:[RouterOutlet,RouterLink,RouterLinkActive],templateUrl:'./shell.component.html',styleUrl:'./shell.component.scss'})
export class ShellComponent {
  readonly auth=inject(AuthService); readonly open=signal(false);
  readonly items=[
    {label:'Personas',route:'/personas',permission:'/personas',icon:'PE'},
    {label:'Usuarios',route:'/usuarios',permission:'/usuarios',icon:'US'},
    {label:'Roles',route:'/roles',permission:'/roles',icon:'RO'},
    {label:'Páginas',route:'/paginas',permission:'/paginas',icon:'PA'},
    {label:'Accesos',route:'/accesos',permission:'/accesos',icon:'AC'}
  ];
  initials():string { const p=this.auth.user()?.persona; return p ? `${p.nombres[0]??''}${p.apellidoPaterno[0]??''}`.toUpperCase() : 'SL'; }
}
