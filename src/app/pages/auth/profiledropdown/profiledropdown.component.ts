import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  dropdownVisible = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeAccount() {
    // Add close account functionality here
    alert('Close Account clicked');
  }

  logout() {
    // Add logout functionality here
    alert('Log out clicked');
  }
}
