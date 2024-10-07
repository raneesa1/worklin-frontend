import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class emailValidatorService {
  private apiUrl = `${environment.backendUrl}/auth`;

  constructor(private http: HttpClient) {}

  checkEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      console.log(email, 'consoling the email from email validation');

      if (!email) {
        alert('no email');
        console.log('no email returning null value');
        return of(null);
      }

      console.log('Making HTTP request to check email');
      return this.http
        .get<{ exists: boolean }>(
          `${this.apiUrl}/check-email?email=${email as string}`
        )
        .pipe(
          map((response) => {
            console.log('HTTP response:', response);
            return response.exists ? { emailTaken: true } : null;
          }),
          catchError((error) => {
            console.log('error from check email taken or not');
            console.error('Error checking email:', error);
            return of(null);
          })
        );
    };
  }
}
