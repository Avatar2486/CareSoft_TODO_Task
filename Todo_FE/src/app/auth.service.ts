import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoginPayload, LoginResponse, SignupPayload, UserInfo } from './models';

const API_BASE = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'todo_token';
  private userKey = 'todo_user';
  user = signal<UserInfo | null>(this.readUser());

  private http = inject(HttpClient);
  private router = inject(Router);

  login(body: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE}/auth/login`, body).pipe(
      map((response) => {
        this.setSession(response);
        return response;
      })
    );
  }

  signup(body: SignupPayload): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${API_BASE}/auth/signup:`, body);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.tokenKey);
  }

  get authHeader(): Record<string, string> | undefined {
    const token = localStorage.getItem(this.tokenKey);
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }

  private setSession(response: LoginResponse) {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify({ id: response.user_id, username: response.username }));
    this.user.set({ id: response.user_id, username: response.username });
  }

  private readUser(): UserInfo | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as UserInfo;
    } catch {
      return null;
    }
  }
}
