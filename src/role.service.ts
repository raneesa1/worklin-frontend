import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class roleService {
  tokenKey = 'auth';
  private refreshUrl = 'http://localhost:8000/auth/refresh-token';
  constructor(
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService,
    private http: HttpClient
  ) {}
  getToken(): string {
    let token = this.cookieService.get(this.tokenKey);
    if (!token) {
      token = localStorage.getItem('auth') || '';
    }
    console.log('Token retrieved:', token);
    return token;
  }

  setToken(token: string): void {
    this.cookieService.set(this.tokenKey, token, {
      secure: true,
      sameSite: 'Strict',
    });
    localStorage.setItem(this.tokenKey, token);
    console.log('Token set:', token);
  }

  // Decode the token using JwtHelperService
  decodeToken(): any | null {
    const token = this.getToken();
    console.log('Token obtained for decoding:', token);
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        console.log('Decoded token:', decodedToken);
        return decodedToken;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    } else {
      console.warn('No token found');
      return null;
    }
  }
  isRole(role: string): boolean {
    console.log('Checking role:', role);
    const decodedToken = this.decodeToken();
    console.log('Decoded token for role check:', decodedToken);
    const hasRole = decodedToken && decodedToken.accountType === role;
    console.log('Role match result:', hasRole);
    return !!hasRole;
  }

  getUserId(): string {
    const decodedToken = this.decodeToken();
    console.log('Decoded token for user ID:', decodedToken);
    const userId = decodedToken?.userId || '';
    console.log('User ID:', userId);
    return userId;
  }

  logout(): void {
    this.cookieService.delete(this.tokenKey);

    // Clear any auth-related local storage items if you're using them
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user'); // If you store user info in localStorage

    console.log('User logged out, auth data cleared');
  }
  refreshToken(): Observable<string> {
    const token = this.getToken();
    console.log('Refreshing token with:', token);

    if (!token) {
      return throwError(() => new Error('No token available to refresh'));
    }

    return this.http.post<{ token: string }>(this.refreshUrl, { token }).pipe(
      switchMap((response) => {
        const newToken = response.token;
        this.setToken(newToken);
        console.log('Token refreshed and updated:', newToken);
        return of(newToken); // Return the new token as an Observable<string>
      }),
      catchError((error) => {
        console.error('Token refresh failed:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }
}
