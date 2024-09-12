import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

// import { GoogleSigninComponent } from './google-signin/google-signin.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';


@NgModule({
  declarations: [],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    AuthRoutingModule,
    // StoreModule.forFeature('auth', accountTypeReducer),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '125784755803-3sor1tr15o31rjgelflafs7femkcip2e.apps.googleusercontent.com',
              {
                scopes: 'openid profile email',
              }
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
})
export class AuthModule {}
