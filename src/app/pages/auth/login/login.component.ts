import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { CookieService } from 'ngx-cookie-service';
import { GoogleSigninComponent } from '../google-signin/google-signin.component';
import { roleService } from '../../../shared/service/role.service';
import { Subject, takeUntil } from 'rxjs';

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
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  handleGoogleLogin(res: any) {}
  private destroy$ = new Subject<void>();

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
      this.authService
        .login(this.loginForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            if (response.token && response.refreshToken) {
              this.roleService.setTokens(response.token, response.refreshToken);
            }
            console.log('Login successful!', response);
            // Redirect based on user account type if needed
            if (response.user.accountType === 'client') {
              this.router.navigate(['client/discover-freelancers']);
            } else if (response.user.accountType === 'freelancer') {
              this.router.navigate(['freelancer/discover']);
            } else if (response.user.accountType === 'admin') {
              this.router.navigate(['admin/dashboard']);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
