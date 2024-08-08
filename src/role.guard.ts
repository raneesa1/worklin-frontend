import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { roleService } from './role.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: roleService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = route.data['expectedRole'];
    console.log('Expected role:', expectedRole); // Log expected role
    const userRole = this.authService.decodeToken()?.accountType;
    console.log('User role from token:', userRole); // Log role from token

    if (userRole === expectedRole) {
      return true;
    } else {
      console.warn('Role guard failed, redirecting to login'); // Log guard failure
      this.router.navigate(['/nx/login']);
      return false;
    }
  }
}
