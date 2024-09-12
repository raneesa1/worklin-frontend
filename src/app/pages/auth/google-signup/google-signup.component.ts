import { Component, OnInit, Renderer2 } from '@angular/core';

import { Store } from '@ngrx/store';

import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
// import { AppState } from '../../state/reducers';
import { AuthService } from '../services/auth.service';
import { AppState } from '../../../state/reducers';
import { roleService } from '../../../shared/service/role.service';
import { selectAccountType } from '../../../state/selectors/account-type.selectors';
// import { roleService } from '../../../role.service';
// import { selectAccountType } from '../../state/selectors/account-type.selectors';

@Component({
  selector: 'app-google-signup',
  standalone: true,
  templateUrl: './google-signup.component.html',
  styleUrls: ['./google-signup.component.scss'],
})
export class GoogleSignupComponent implements OnInit {
  accountType: string | null = null;

  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router,
    private roleService: roleService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loadGoogleScript().then(() => {
      this.initializeGoogleSignUp();
    });

    // Retrieve account type from store
    this.store.select(selectAccountType).subscribe((accountType) => {
      this.accountType = accountType;
      console.log(this.accountType, 'consoling the account type');
    });
  }

  loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google script failed to load.'));
      this.renderer.appendChild(document.body, script);
    });
  }

  initializeGoogleSignUp(): void {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.initialize({
        client_id:
          '125784755803-3sor1tr15o31rjgelflafs7femkcip2e.apps.googleusercontent.com',
        callback: (response: any) => {
          try {
            console.log(response);
            const credential = response.credential;
            const accountType = this.accountType; // Use the accountType from the store
            const signupData = { credential, accountType };
            console.log(signupData, 'consoling the signup data');
            this.authService.googleSignup(signupData).subscribe(
              (response) => {
               if (response.token && response.refreshToken) {
                 this.roleService.setTokens(
                   response.token,
                   response.refreshToken
                 );
               }
                console.log('Signup successful!', response);
                // Redirect based on user account type
                if (response.user.accountType === 'client') {
                  this.router.navigate(['client/clientIntro']);
                } else if (response.user.accountType === 'freelancer') {
                  this.router.navigate(['freelancer/page-one']);
                } else if (response.user.accountType === 'admin') {
                  this.router.navigate(['admin/dashboard']);
                }
              },
              (error) => {
                console.error('Signup failed', error);
              }
            );
          } catch (error) {
            console.error('Error during Google Sign-In', error);
          }
        },
      });
      google.accounts.id.renderButton(document.getElementById('google-btn'), {
        theme: 'filled_blue',
        size: 'large',
        shape: 'pill',
        width: 350,
      });
    } else {
      console.error('Google accounts object is not available.');
    }
  }
}
