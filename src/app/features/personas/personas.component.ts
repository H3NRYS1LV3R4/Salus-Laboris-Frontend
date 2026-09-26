import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Persona, PersonaPayload } from '../../core/api.models';
import { PersonasService } from './personas.service';

@Component({selector:'app-personas',imports:[ReactiveFormsModule],templateUrl:'./personas.component.html',styleUrl:'./personas.component.scss'})
export class PersonasComponent implements OnInit {
  private readonly service=inject(PersonasService); private readonly fb=inject(FormBuilder);
  readonly rows=signal<Persona[]>([]); readonly loading=signal(true); readonly saving=signal(false);
  readonly modal=signal(false); readonly editing=signal<Persona|null>(null); readonly message=signal(''); readonly error=signal('');
  readonly page=signal(0); readonly totalPages=signal(0); readonly total=signal(0); readonly query=signal('');
  readonly maxBirthDate=new Date().toISOString().slice(0,10);
  readonly filtered=computed(()=>{const q=this.query().toLowerCase().trim();return q?this.rows().filter(p=>`${p.nombres} ${p.apellidoPaterno} ${p.nroDocumento}`.toLowerCase().includes(q)):this.rows();});
  readonly form=this.fb.nonNullable.group({
    tipoDocumento:['DNI',[Validators.required,Validators.maxLength(20)]],nroDocumento:['',[Validators.required,Validators.pattern(/^\d{8}$/)]],
    nombres:['',[Validators.required,Validators.maxLength(100),Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/)]],apellidoPaterno:['',[Validators.required,Validators.maxLength(100),Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/)]],apellidoMaterno:['',[Validators.maxLength(100),Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]*$/)]],
    fechaNacimiento:['',Validators.required],correo:['',[Validators.email,Validators.maxLength(150)]],telefono:['',[Validators.pattern(/^9\d{8}$/)]]
  });
  ngOnInit():void {
    this.form.controls.tipoDocumento.valueChanges.subscribe(type=>this.configureDocument(type));
    this.load();
  }
  load(page=this.page()):void { this.loading.set(true);this.error.set('');this.service.list(page,20).subscribe({next:r=>{this.rows.set(r.content);this.page.set(r.page);this.totalPages.set(r.totalPages);this.total.set(r.totalElements);this.loading.set(false);},error:()=>{this.error.set('No se pudo cargar la información.');this.loading.set(false);}}); }
  open(person?:Persona):void { this.editing.set(person??null);this.message.set('');this.error.set('');if(person)this.form.reset({tipoDocumento:person.tipoDocumento,nroDocumento:person.nroDocumento,nombres:person.nombres,apellidoPaterno:person.apellidoPaterno,apellidoMaterno:person.apellidoMaterno??'',fechaNacimiento:person.fechaNacimiento,correo:person.correo??'',telefono:person.telefono??''});else this.form.reset({tipoDocumento:'DNI',nroDocumento:'',nombres:'',apellidoPaterno:'',apellidoMaterno:'',fechaNacimiento:'',correo:'',telefono:''});this.modal.set(true); }
  close():void { if(!this.saving())this.modal.set(false); }
  save():void {
    if(this.form.invalid){this.form.markAllAsTouched();return;} this.saving.set(true);this.error.set('');const v=this.form.getRawValue();
    const payload:PersonaPayload={...v,nroDocumento:v.nroDocumento.trim(),nombres:v.nombres.trim(),apellidoPaterno:v.apellidoPaterno.trim(),apellidoMaterno:v.apellidoMaterno.trim()||null,correo:v.correo.trim()||null,telefono:v.telefono.trim()||null};
    const request=this.editing()?this.service.update(this.editing()!.id,payload):this.service.create(payload);
    request.subscribe({next:()=>{this.saving.set(false);this.modal.set(false);this.message.set(this.editing()?'Persona actualizada correctamente.':'Persona registrada correctamente.');this.load();},error:(e:HttpErrorResponse)=>{this.saving.set(false);this.error.set(this.apiMessage(e));}});
  }
  toggle(person:Persona):void { if(!confirm(`¿Deseas ${person.estado?'desactivar':'activar'} a ${person.nombres}?`))return;this.service.status(person.id,!person.estado).subscribe({next:()=>{this.message.set('Estado actualizado correctamente.');this.load();},error:(e:HttpErrorResponse)=>this.error.set(this.apiMessage(e))}); }
  documentHint():string {
    switch(this.form.controls.tipoDocumento.value){
      case 'DNI': return 'Ingresa exactamente 8 números.';
      case 'CE': return 'Ingresa entre 9 y 12 letras o números.';
      case 'PASAPORTE': return 'Ingresa entre 6 y 20 letras o números.';
      default: return 'Ingresa entre 4 y 20 letras, números o guiones.';
    }
  }
  documentInputMode():string { return this.form.controls.tipoDocumento.value==='DNI'?'numeric':'text'; }
  private configureDocument(type:string):void {
    const patterns:Record<string,RegExp>={
      DNI:/^\d{8}$/,
      CE:/^[A-Za-z0-9]{9,12}$/,
      PASAPORTE:/^[A-Za-z0-9]{6,20}$/,
      OTRO:/^[A-Za-z0-9-]{4,20}$/
    };
    this.form.controls.nroDocumento.setValidators([Validators.required,Validators.pattern(patterns[type]??patterns['OTRO'])]);
    this.form.controls.nroDocumento.updateValueAndValidity();
  }
  private apiMessage(e:HttpErrorResponse):string { return e.error?.message??(e.status===409?'El documento o correo ya se encuentra registrado.':'No se pudo completar la operación.'); }
}
