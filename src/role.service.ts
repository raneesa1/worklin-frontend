import { Injectable } from '@angular/core';
// import * as jwt_decode from 'jwt-decode';
import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class roleService {
  private readonly tokenKey = 'auth';
  private jwtHelper = new JwtHelperService();

  constructor(private cookieService: CookieService) {}

  // Store the token in cookies and update local state
  storeToken(token: string): void {
    this.cookieService.set(this.tokenKey, token);
    console.log('Token stored:', token);
  }

  // Retrieve the token from cookies
  getToken(): string | null {
    return this.cookieService.get(this.tokenKey);
  }
  decodeToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        return JSON.parse(payloadJson);
      } catch (error) {
        console.error('Error decoding token:', error); // Handle decoding error
      }
    }
    return null;
  }

  isRole(role: string): boolean {
    const decodedToken = this.decodeToken();
    console.log('Decoded token:', decodedToken); // Log decoded token
    return decodedToken && decodedToken.accountType === role;
  }
  getUserId(): string | null {
    const decodedToken = this.decodeToken();
    console.log('Decoded token:', decodedToken); // Log decoded token
    return decodedToken ? decodedToken.userId : null; // Adjust key name if necessary
  }
}