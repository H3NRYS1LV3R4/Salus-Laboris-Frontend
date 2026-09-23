import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from './api.models';

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
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { nombreUsuario, password }).pipe(tap(response => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response)); this.state.set(response);
    }));
  }
  token():string|null { return this.state()?.accessToken ?? null; }
  hasPage(route:string):boolean { return this.pages().some(page => page.estado && page.ruta === route); }
  logout(redirect=true):void { localStorage.removeItem(STORAGE_KEY); this.state.set(null); if (redirect) void this.router.navigate(['/login']); }
  private readSession():AuthResponse|null {
    try { const value=localStorage.getItem(STORAGE_KEY); return value ? JSON.parse(value) as AuthResponse : null; }
    catch { localStorage.removeItem(STORAGE_KEY); return null; }
  }
}
