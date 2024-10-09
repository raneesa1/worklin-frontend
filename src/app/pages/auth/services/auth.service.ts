import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: any;
  private apiUrl = `${environment.backendUrl}/auth`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data, {
      withCredentials: true,
    });
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, data, {
      withCredentials: true,
    });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/verify-otp`,
      { email, otp },
      {
        withCredentials: true,
      }
    );
  }
  googleSignin(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/google-signin`, data, {
      withCredentials: true,
    });
  }
  googleSignup(data: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/google-signup`, data, {
      withCredentials: true,
    });
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-otp`, { email });
  }
}
