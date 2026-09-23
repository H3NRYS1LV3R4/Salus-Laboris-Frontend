import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse, Pagina, PaginaPayload, Persona, Rol, RolPayload, Usuario, UsuarioCreatePayload, UsuarioUpdatePayload } from './api.models';

@Injectable({providedIn:'root'})
export class AdminService {
  private readonly http=inject(HttpClient); private readonly api='http://localhost:8080/api/v1';
  usuarios(page=0,size=20):Observable<PageResponse<Usuario>> { return this.http.get<PageResponse<Usuario>>(`${this.api}/usuarios`,{params:{page,size}}); }
  crearUsuario(body:UsuarioCreatePayload):Observable<Usuario> { return this.http.post<Usuario>(`${this.api}/usuarios`,body); }
  actualizarUsuario(id:number,body:UsuarioUpdatePayload):Observable<Usuario> { return this.http.put<Usuario>(`${this.api}/usuarios/${id}`,body); }
  estadoUsuario(id:number,estado:boolean):Observable<Usuario> { return this.http.patch<Usuario>(`${this.api}/usuarios/${id}/estado`,{estado}); }
  passwordUsuario(id:number,password:string):Observable<void> { return this.http.put<void>(`${this.api}/usuarios/${id}/password`,{password}); }
  personas(page=0,size=100):Observable<PageResponse<Persona>> { return this.http.get<PageResponse<Persona>>(`${this.api}/personas`,{params:{page,size}}); }
  roles(page=0,size=100):Observable<PageResponse<Rol>> { return this.http.get<PageResponse<Rol>>(`${this.api}/roles`,{params:{page,size}}); }
  crearRol(body:RolPayload):Observable<Rol> { return this.http.post<Rol>(`${this.api}/roles`,body); }
  actualizarRol(id:number,body:RolPayload):Observable<Rol> { return this.http.put<Rol>(`${this.api}/roles/${id}`,body); }
  estadoRol(id:number,estado:boolean):Observable<Rol> { return this.http.patch<Rol>(`${this.api}/roles/${id}/estado`,{estado}); }
  paginas(page=0,size=100):Observable<PageResponse<Pagina>> { return this.http.get<PageResponse<Pagina>>(`${this.api}/paginas`,{params:{page,size}}); }
  crearPagina(body:PaginaPayload):Observable<Pagina> { return this.http.post<Pagina>(`${this.api}/paginas`,body); }
  actualizarPagina(id:number,body:PaginaPayload):Observable<Pagina> { return this.http.put<Pagina>(`${this.api}/paginas/${id}`,body); }
  estadoPagina(id:number,estado:boolean):Observable<Pagina> { return this.http.patch<Pagina>(`${this.api}/paginas/${id}/estado`,{estado}); }
  accesos(idRol:number):Observable<Pagina[]> { return this.http.get<Pagina[]>(`${this.api}/accesos/roles/${idRol}`); }
  asignarAccesos(idRol:number,idPaginas:number[]):Observable<Pagina[]> { return this.http.put<Pagina[]>(`${this.api}/accesos/roles/${idRol}`,{idPaginas}); }
}
