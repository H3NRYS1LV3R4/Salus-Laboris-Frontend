import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../core/admin.service';
import { Persona, Rol, Usuario } from '../../core/api.models';

@Component({selector:'app-usuarios',imports:[ReactiveFormsModule],templateUrl:'./usuarios.component.html',styleUrl:'./usuarios.component.scss'})
export class UsuariosComponent implements OnInit {
  private readonly api=inject(AdminService); private readonly fb=inject(FormBuilder);
  readonly rows=signal<Usuario[]>([]); readonly personas=signal<Persona[]>([]); readonly roles=signal<Rol[]>([]);
  readonly loading=signal(true); readonly saving=signal(false); readonly modal=signal(false); readonly passwordModal=signal(false);
  readonly editing=signal<Usuario|null>(null); readonly selected=signal<Usuario|null>(null); readonly message=signal(''); readonly error=signal('');
  readonly page=signal(0); readonly totalPages=signal(0); readonly total=signal(0); readonly query=signal('');
  readonly filtered=computed(()=>{const q=this.query().trim().toLowerCase();return q?this.rows().filter(u=>`${u.nombreUsuario} ${u.persona.nombres} ${u.persona.apellidoPaterno} ${u.rol.nombre}`.toLowerCase().includes(q)):this.rows();});
  readonly form=this.fb.nonNullable.group({idPersona:[0,[Validators.required,Validators.min(1)]],idRol:[0,[Validators.required,Validators.min(1)]],nombreUsuario:['',[Validators.required,Validators.pattern(/^[A-Za-z0-9._-]{3,50}$/)]],password:['',[Validators.minLength(12),Validators.maxLength(72)]]});
  readonly passwordForm=this.fb.nonNullable.group({password:['',[Validators.required,Validators.minLength(12),Validators.maxLength(72)]],confirmacion:['',Validators.required]});
  ngOnInit():void { this.loadCatalogs();this.load(); }
  load(page=this.page()):void { this.loading.set(true);this.api.usuarios(page,20).subscribe({next:r=>{this.rows.set(r.content);this.page.set(r.page);this.totalPages.set(r.totalPages);this.total.set(r.totalElements);this.loading.set(false);},error:()=>{this.error.set('No se pudieron cargar los usuarios.');this.loading.set(false);}}); }
  loadCatalogs():void { forkJoin({personas:this.api.personas(),roles:this.api.roles()}).subscribe({next:r=>{this.personas.set(r.personas.content);this.roles.set(r.roles.content.filter(x=>x.estado));}}); }
  open(user?:Usuario):void { this.error.set('');this.editing.set(user??null);this.form.reset({idPersona:user?.persona.id??0,idRol:user?.rol.id??0,nombreUsuario:user?.nombreUsuario??'',password:''});this.form.controls.idPersona[user?'disable':'enable']();this.modal.set(true); }
  close():void { if(!this.saving())this.modal.set(false); }
  save():void { const editing=this.editing();if(!editing&&!this.form.controls.password.value)this.form.controls.password.setErrors({required:true});if(this.form.invalid){this.form.markAllAsTouched();return;}this.saving.set(true);this.error.set('');const v=this.form.getRawValue();const req=editing?this.api.actualizarUsuario(editing.id,{idRol:v.idRol,nombreUsuario:v.nombreUsuario.trim()}):this.api.crearUsuario({idPersona:v.idPersona,idRol:v.idRol,nombreUsuario:v.nombreUsuario.trim(),password:v.password});req.subscribe({next:()=>{this.saving.set(false);this.modal.set(false);this.message.set(editing?'Usuario actualizado correctamente.':'Usuario creado correctamente.');this.load();},error:e=>{this.saving.set(false);this.error.set(this.apiMessage(e));}}); }
  toggle(user:Usuario):void { if(!confirm(`¿Deseas ${user.estado?'desactivar':'activar'} este usuario?`))return;this.api.estadoUsuario(user.id,!user.estado).subscribe({next:()=>{this.message.set('Estado actualizado correctamente.');this.load();},error:e=>this.error.set(this.apiMessage(e))}); }
  openPassword(user:Usuario):void { this.selected.set(user);this.passwordForm.reset();this.error.set('');this.passwordModal.set(true); }
  savePassword():void { const v=this.passwordForm.getRawValue();if(this.passwordForm.invalid||v.password!==v.confirmacion){if(v.password!==v.confirmacion)this.passwordForm.controls.confirmacion.setErrors({mismatch:true});this.passwordForm.markAllAsTouched();return;}this.saving.set(true);this.api.passwordUsuario(this.selected()!.id,v.password).subscribe({next:()=>{this.saving.set(false);this.passwordModal.set(false);this.message.set('Contraseña actualizada correctamente.');},error:e=>{this.saving.set(false);this.error.set(this.apiMessage(e));}}); }
  private apiMessage(e:HttpErrorResponse):string { return e.error?.message??(e.status===409?'El nombre de usuario o la persona ya están asignados.':'No se pudo completar la operación.'); }
}
