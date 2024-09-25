import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Component, inject, Renderer2 } from '@angular/core';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { roleService } from '../../../shared/service/role.service';

@Component({
  selector: 'app-google-signin',
  standalone: true,
  imports: [GoogleSigninButtonModule, CommonModule],
  templateUrl: './google-signin.component.html',
  styleUrl: './google-signin.component.scss',
})
export class GoogleSigninComponent {
  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private roleService: roleService,
    private cookieService: CookieService
  ) {}
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadGoogleScript().then(() => {
      this.initializeGoogleSignIn();
    });

    this.socialAuthService.authState.subscribe((result) => {
      this.handleGoogleSignIn(result.idToken);
      console.log(result, 'consoling the result from the social auth');
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

  initializeGoogleSignIn(): void {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.initialize({
        client_id:
          '125784755803-3sor1tr15o31rjgelflafs7femkcip2e.apps.googleusercontent.com',
        callback: (response: any) => {
          console.log(response);
        },
      });
      google.accounts.id.renderButton(document.getElementById('google-btn'), {
        theme: 'filled_blue',
        size: 'large',
        width: 350,
      });
    } else {
      console.error('Google accounts object is not available.');
    }
  }
  handleGoogleSignIn(idToken: string): void {
    this.authService.googleSignin({ credential: idToken }).subscribe({
      next: (response) => {
        console.log(response, 'consoling the response');
       if (response.token && response.refreshToken) {
         this.roleService.setTokens(
           response.token,
           response.refreshToken
         );
       }
        console.log('Backend response:', response);
        // Redirect based on user account type
        if (response.user.accountType === 'client') {
          this.router.navigate(['client/discover']);
        } else if (response.user.accountType === 'freelancer') {
          this.router.navigate(['freelancer/discover']);
        } else if (response.user.accountType === 'admin') {
          this.router.navigate(['admin/dashboard']);
        }
      },
      error: (error) => {
        console.error('Backend error:', error);
        this.errorMessage =
          error.error?.message || 'An error occurred. Please try again.';
      },
    });
  }
}
