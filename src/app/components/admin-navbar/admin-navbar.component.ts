import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { roleService } from '../../shared/service/role.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss',
})
export class AdminNavbarComponent {
  isMobileMenuOpen: boolean = false;
  isDropdownOpen: boolean = false;

  constructor(private router: Router, private roleService: roleService) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('#dropdownButton') &&
      !target.closest('#dropdownMenu')
    ) {
      this.isDropdownOpen = false;
    }
  }
  logout() {
    this.roleService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
