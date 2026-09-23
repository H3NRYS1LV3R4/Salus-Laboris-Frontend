import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthResponse, LoginApiResponse } from './api.models';

export const API_URL = 'http://localhost:8080/api/v1';
const STORAGE_KEY = 'salus_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly state = signal<AuthResponse | null>(this.readSession());
  readonly session = this.state.asReadonly();
  readonly user = computed(() => this.state()?.usuario ?? null);
  readonly pages = computed(() => this.state()?.paginas ?? []);
  readonly authenticated = computed(() => !!this.state()?.accessToken);

  login(nombreUsuario:string, password:string):Observable<AuthResponse> {
    return this.http.post<LoginApiResponse>(`${API_URL}/auth/login`, { nombreUsuario, password }).pipe(
      map(response => {
        const session:AuthResponse={
          accessToken:response.accessToken??response.token??'',
          tokenType:response.tokenType,
          expiresIn:response.expiresIn??response.expiresInSeconds??0,
          usuario:response.usuario,
          paginas:response.paginas??[]
        };
        localStorage.setItem(STORAGE_KEY,JSON.stringify(session));
        this.state.set(session);
        return session;
      })
    );
  }
  token():string|null { return this.state()?.accessToken ?? null; }
  hasPage(route:string):boolean {
    const aliases=route==='/usuarios'?[route,'/admin/usuarios']:[route];
    return this.pages().some(page=>page.estado&&aliases.includes(page.ruta));
  }
  logout(redirect=true):void { localStorage.removeItem(STORAGE_KEY); this.state.set(null); if (redirect) void this.router.navigate(['/login']); }
  private readSession():AuthResponse|null {
    try { const value=localStorage.getItem(STORAGE_KEY); return value ? JSON.parse(value) as AuthResponse : null; }
    catch { localStorage.removeItem(STORAGE_KEY); return null; }
  }
}
