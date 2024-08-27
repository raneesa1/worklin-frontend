import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { GoogleSigninComponent } from '../../google-signin/google-signin.component';
import { roleService } from '../../../role.service';
import { CookieService } from 'ngx-cookie-service';
declare var google: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    GoogleSigninComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  handleGoogleLogin(res: any) {}

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private roleService: roleService,
    private cookieService: CookieService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          if (response.token) {
            this.cookieService.set('auth', response.token, {
              secure: true,
              sameSite: 'Strict',
            });
            localStorage.setItem('auth', response.token);
          }
          console.log('Login successful!', response);
          // Redirect based on user account type if needed
          if (response.user.accountType === 'client') {
            this.router.navigate(['job/clientIntro']);
          } else if (response.user.accountType === 'freelancer') {
            this.router.navigate(['user/page-one']);
          } else if (response.user.accountType === 'admin') {
            this.router.navigate(['admin/skill']);
          }
        },
        (error) => {
          console.error('Login failed', error);
          if (error.error?.errors?.length) {
            this.errorMessage =
              error.error.errors[0]?.message ||
              'Login failed. Please try again.';
          } else {
            this.errorMessage =
              'An unexpected error occurred. Please try again.';
          }
        }
      );
    }
  }
}
