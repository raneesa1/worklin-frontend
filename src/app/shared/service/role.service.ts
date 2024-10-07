import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class roleService {
  private apiUrl = `${environment.backendUrl}/auth`;

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) {}

  getAccessToken(): string {
    const accessToken = localStorage.getItem('accessToken') || '';
    console.log(accessToken, 'consoling the access token ');
    return accessToken;
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken') || '';
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    console.log(refreshToken, 'consoling the refresh token');
    localStorage.setItem('refreshToken', refreshToken);
  }

  removeTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  decodeToken(token: string): any | null {
    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getFirstName(): string {
    const decodedToken = this.decodeToken(this.getAccessToken());
    return decodedToken?.firstName || '';
  }

  isRole(role: string): boolean {
    const decodedToken = this.decodeToken(this.getAccessToken());
    return decodedToken?.accountType === role;
  }

  getUserRole(): string {
    const decodedToken = this.decodeToken(this.getAccessToken());
    return decodedToken?.accountType || '';
  }

  getUserId(): string {
    const decodedToken = this.decodeToken(this.getAccessToken());
    return decodedToken?.userId || '';
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap((tokens: any) => {
          this.setTokens(tokens.accessToken, tokens.refreshToken);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.removeTokens();
    // Add any additional logout logic here (e.g., navigating to login page)
  }
}
