import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { roleService } from './app/shared/service/role.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private roleService: roleService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.roleService.isRole(expectedRole);

    if (userRole) {
      return true;
    } else {
      console.warn('Role guard failed, redirecting to login');
      this.router.navigate(['/nx/login']);
      return false;
    }
  }
}
