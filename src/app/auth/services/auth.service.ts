import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN_KEY = 'auth';

  private userData: any;
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(data: any): Observable<any> {
    return this.http.post<any>('/auth/login', data, {
      withCredentials: true
    });
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>('/auth/signup', data, {
      withCredentials: true,
    });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(
      '/auth/verify-otp',
      { email, otp },
      {
        withCredentials: true,
      }
    );
  }
  googleSignin(data: any): Observable<any> {
    return this.http.post<any>('/auth/google-signin', data, {
      withCredentials: true,
    });
  }
  googleSignup(data: object): Observable<any> {
    return this.http.post<any>('/auth/google-signup', data, {
      withCredentials: true,
    });
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post('/auth/resend-otp', { email });
  }
  storeToken(token: string) {
    this.cookieService.set(this.JWT_TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.cookieService.get(this.JWT_TOKEN_KEY) || null;
  }
}
