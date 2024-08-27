import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service'; // Adjust the path as needed
import { roleService } from '../../role.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private roleService: roleService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the auth token from the roleService
    const authToken = this.roleService.getToken();

    // Clone the request and add the authorization header
    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      });
    }

    // Handle the request and potential errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !authReq.url.includes('auth/login')) {
          // Token might be expired, try refreshing it
          return this.roleService.refreshToken().pipe(
            switchMap((newToken: string) => {
              this.roleService.setToken(newToken); // Update the token using roleService
              const newAuthReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next.handle(newAuthReq);
            }),
            catchError((err) => {
              this.roleService.logout(); // Handle logout on refresh token failure
              return throwError(() => err);
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
