import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'admin_token';
  private apiUrl = `${environment.apiUrl}/login`;
  // private apiUrl = 'http://127.0.0.1:5000/api/login';
  constructor(private http: HttpClient) {}

  login(password: string) {
    return this.http.post<{ token: string }>(this.apiUrl, { password }).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
