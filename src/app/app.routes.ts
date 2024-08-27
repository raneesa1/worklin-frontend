import { Routes } from '@angular/router';
import { GoogleSigninComponent } from './google-signin/google-signin.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RoleGuard } from '../role.guard';
import { AdminDashboardComponent } from './admin-management/admin-dashboard/admin-dashboard.component';
import { ListFreelancersComponent } from './admin-management/list-freelancers/list-freelancers.component';

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
    data: { expectedRole: 'freelancer' },
  },
  {
    path: 'job',
    loadChildren: () =>
      import('./job-management/job-post.module').then((m) => m.JobPostModule),
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
      import('./admin-management/admin-management.module').then(
        (m) => m.AdminManagementModule
      ),
    // canActivate: [RoleGuard],
    // data: { expectedRole: 'admin' }, // Only admins can access
  },
  {
    path: 'p',
    component: AdminDashboardComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
  { path: 'freelancer', component: ListFreelancersComponent },
];
