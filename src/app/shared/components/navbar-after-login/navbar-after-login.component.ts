import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar-after-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-after-login.component.html',
  styleUrl: './navbar-after-login.component.scss',
})
export class NavbarAfterLoginComponent {
  isMobileMenuOpen: boolean = false;
  isDropdownOpen: boolean = false;

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
}
