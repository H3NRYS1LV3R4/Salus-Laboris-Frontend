import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';

@Component({ selector:'app-login', imports:[ReactiveFormsModule], templateUrl:'./login.component.html', styleUrl:'./login.component.scss' })
export class LoginComponent {
  private readonly fb=inject(FormBuilder); private readonly auth=inject(AuthService);
  readonly loading=signal(false); readonly showPassword=signal(false); readonly error=signal('');
  readonly form=this.fb.nonNullable.group({ nombreUsuario:['',[Validators.required,Validators.maxLength(50)]], password:['',[Validators.required,Validators.minLength(8)]] });
  submit():void {
    if(this.form.invalid){this.form.markAllAsTouched();return;}
    this.loading.set(true); this.error.set('');
    this.auth.login(this.form.getRawValue().nombreUsuario.trim(),this.form.getRawValue().password).subscribe({
      next:response=>{
        this.loading.set(false);
        if (!response?.accessToken) {
          this.error.set('El servidor no devolvió una sesión válida.');
          return;
        }
        window.location.assign('/dashboard');
      },
      error:(e:HttpErrorResponse)=>{
        this.loading.set(false);
        this.error.set(e.status===0
          ?'No se pudo conectar con el servidor. Verifica que Spring Boot esté encendido.'
          :e.status===401?'Usuario o contraseña incorrectos.':'No se pudo iniciar sesión. Inténtalo nuevamente.');
      }
    });
  }
}
