import { Routes } from '@angular/router';
import { GoogleSigninComponent } from './google-signin/google-signin.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RoleGuard } from '../role.guard';

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
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
    canActivate: [RoleGuard],
    data: { expectedRole: 'freelancer' }, // Only freelancers can access
  },
  {
    path: 'job',
    loadChildren: () =>
      import('./job-management/job-post.module').then((m) => m.JobPostModule),
    canActivate: [RoleGuard],
    data: { expectedRole: 'client' }, // Only clients can access
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
      import('./admin-management/admin-management.module').then(
        (m) => m.AdminManagementModule
      ),
    canActivate: [RoleGuard],
    data: { expectedRole: 'admin' }, // Only admins can access
  },
  {
    path: '**',
    redirectTo: '', 
  },
];
