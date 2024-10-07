import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DxFileUploaderModule } from 'devextreme-angular';

import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { environment } from '../environment/environment';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { rootReducer } from './state/reducers';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

export function tokenGetter(cookieService: CookieService) {
  return cookieService.get('auth');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireMessagingModule
    ),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => tokenGetter(inject(CookieService)),
          allowedDomains: ['localhost:3000'],
          disallowedRoutes: [
            `${environment.backendUrl}/auth/login`,
            `${environment.backendUrl}/auth/signup`,
          ],
        },
      })
    ),
    DxFileUploaderModule,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '991799621824-0r0rvo9sr9d32bd0mm7a1pj2ae94mmbk.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err: any) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    JwtHelperService,
    CookieService,
    provideStore(rootReducer),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync('noop'),
  ],
};
