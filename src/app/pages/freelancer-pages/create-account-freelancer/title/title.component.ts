import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { roleService } from '../../../../shared/service/role.service';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent {
  role: string = '';
  errorMessage = false;

  constructor(
    private router: Router,
    private profileManagementService: ProfileManagementService,
    private roleService: roleService
  ) {}

  proceed(): void {
    if (!this.role.trim()) {
      this.errorMessage = true;
    } else {
      this.errorMessage = false;
      const freelancerId = this.roleService.getUserId();
      if (freelancerId) {
        this.profileManagementService
          .saveRole(freelancerId, this.role)
          .subscribe({
            next: (response) => {
              console.log('Role saved successfully:', response);
              this.router.navigate(['/freelancer/create-account-experience']);
            },
            error: (error) => {
              console.error('Error saving role:', error);
            },
          });
      } else {
        console.error('User ID not found');
      }
    }
  }

  onInputChange(): void {
    this.errorMessage = false;
  }
}
