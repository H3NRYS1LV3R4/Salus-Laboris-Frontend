import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../core/auth.service';
import { PageResponse, Persona, PersonaPayload } from '../../core/api.models';

@Injectable({providedIn:'root'})
export class PersonasService {
  private readonly http=inject(HttpClient);
  list(page:number,size:number):Observable<PageResponse<Persona>> { return this.http.get<PageResponse<Persona>>(`${API_URL}/personas?page=${page}&size=${size}`); }
  create(data:PersonaPayload):Observable<Persona> { return this.http.post<Persona>(`${API_URL}/personas`,data); }
  update(id:number,data:PersonaPayload):Observable<Persona> { return this.http.put<Persona>(`${API_URL}/personas/${id}`,data); }
  status(id:number,estado:boolean):Observable<Persona> { return this.http.patch<Persona>(`${API_URL}/personas/${id}/estado`,{estado}); }
}
