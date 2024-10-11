import { Routes } from '@angular/router';

import { RoleGuard } from '../role.guard';
import { GoogleSigninComponent } from './pages/auth/google-signin/google-signin.component';
import { VideoCallComponentComponent } from './components/video-call-component/video-call-component.component';
import { PaymentFailComponent } from './components/payment-fail/payment-fail.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCheckoutComponent } from './pages/client-pages/payment-checkout/payment-checkout.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./shared/components/landing/landing.module').then(
        (m) => m.LandingModule
      ),
  },
  {
    path: 'nx',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'freelancer',
    loadChildren: () =>
      import('./pages/freelancer-pages/freelancer.module').then(
        (m) => m.FreelancerModule
      ),
    canActivate: [RoleGuard],
    data: { expectedRole: 'freelancer' },
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./pages/client-pages/client.module').then((m) => m.ClientModule),
    canActivate: [RoleGuard],
    data: { expectedRole: 'client' },
  },
  {
    path: 'browse',
    loadChildren: () =>
      import('./browse/browse.module').then((m) => m.BrowseModule),
  },
  {
    path: 'google/login',
    component: GoogleSigninComponent,
  },
  {
    path: 'project',
    loadChildren: () =>
      import('./project-management/project-management.module').then(
        (m) => m.ProjectManagementModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin-management/admin-management.module').then(
        (m) => m.AdminManagementModule
      ),
    canActivate: [RoleGuard],
    data: { expectedRole: 'admin' }, // Only admins can access
  },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-failed', component: PaymentFailComponent },
  { path: 'checkout', component: PaymentCheckoutComponent },
  { path: 'video-call', component: VideoCallComponentComponent },
  {
    path: '**',
    redirectTo: '',
  },
];
