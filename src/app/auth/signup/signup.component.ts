import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { GoogleSigninComponent } from '../../google-signin/google-signin.component';
// import { emailValidatorService } from '../../services/emailValidator.service';
import { State, Store } from '@ngrx/store';
import { AppState } from '../../state/reducers';
import { selectAccountType } from '../../state/selectors/account-type.selectors'; // Ensure this import is correct
import { GoogleSignupComponent } from '../../google-signup/google-signup.component';
import { AuthService } from '../services/auth.service';
import { VerifyemailComponent } from '../verifyEmail/verifyemail.component';
import { AccountTypeComponent } from '../account-type/account-type.component';
import { roleService } from '../../../role.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GoogleSigninComponent,
    GoogleSignupComponent,
    VerifyemailComponent,
    AccountTypeComponent,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  accountSelected = false;
  errorMessage: string | null = null;
  accountType: string | null = null;
  isOtp = false;
  otp: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private roleService: roleService,
    private cookieService: CookieService
  ) {
    console.log('checkEmailNotTaken called');

    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.email],
        // [this.emailValidator.checkEmailNotTaken()],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', Validators.required],
    });
  }

  getAccountType(type: string): void {
    this.accountType = type;
    console.log(type, '==>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    this.accountSelected = true;
  }

  get firstName() {
    return this.signupForm.get('firstName');
  }
  get lastName() {
    return this.signupForm.get('lastName');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get country() {
    return this.signupForm.get('country');
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading = true;
      const signupData = {
        ...this.signupForm.value,
        accountType: this.accountType,
      };
      console.log(signupData, 'consoling the signup data');

      this.authService.signup(signupData).subscribe(
        (response) => {
          console.log(response, 'consoling the response from singup');
          this.loading = false;
          // In onSubmit method, confirm the token is being set correctly:
          if (response.token) {
            this.cookieService.set('auth', response.token, {
              secure: true,
              sameSite: 'Strict',
            });
            localStorage.setItem('auth', response.token);
          }
          // Assuming the server responds with user information
          if (response.user) {
            if (response.user.accountType === 'client') {
              this.router.navigate(['job/clientIntro']);
            } else if (response.user.accountType === 'freelancer') {
              this.router.navigate(['user/page-one']);
            } else if (response.user.accountType === 'admin') {
              this.router.navigate(['admin/skill']);
            }
          }
          this.isOtp = true;
        },
        (error) => {
          console.error('signup failed', error);
          if (
            error.status === 400 &&
            error.error.message === 'Email already exists'
          ) {
            this.errorMessage = 'This email is already registered.';
          } else {
            this.errorMessage = 'Signup failed. Please try again.';
          }
          this.loading = false;
        }
      );
    }
  }

  handleOtpSubmitted(otp: string[]) {
    console.log('Received OTP from child:', otp);
    const joinedOtp = otp.join('');
    console.log(joinedOtp, 'consoling the joined otp');
    const credentials = {
      ...this.signupForm.value,
      accountType: this.accountType,
      otp: joinedOtp,
    };
    console.log(credentials, 'consoling the credetialssssss data');
    this.authService.signup(credentials).subscribe(
      (response) => {
        if (response.token) {
          this.cookieService.set('auth', response.token, {
            secure: true,
            sameSite: 'Strict',
          });
          localStorage.setItem('auth', response.token);
        }
        console.log('Ottppppppppppppppppp!', response);
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
        console.error('signup failed', error);
      }
    );
  }
}
