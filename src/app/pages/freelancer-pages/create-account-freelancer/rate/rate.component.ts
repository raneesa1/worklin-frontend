import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { roleService } from '../../../../shared/service/role.service';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { BioData } from '../../../../shared/types/interfaces/bioData';

@Component({
  selector: 'app-rate',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.scss',
})
export class RateComponent {
  @Input() languages: { language: string; proficiency: string }[] = [];
  @Input() bio: string = '';

  hourlyRate: number | null = null;
  serviceFee: number | null = null;
  rateError = false;

  constructor(
    private profileService: ProfileManagementService,
    private roleService: roleService,
    private router: Router
  ) {}

  validateInput(): void {
    this.rateError = !this.hourlyRate;
  }

  submitData() {
    this.validateInput();

    if (this.rateError) {
      return;
    }

    const userId = this.roleService.getUserId();
    const rateData: BioData = {
      userId: userId ?? '',
      languages: this.languages,
      hourlyRate: this.hourlyRate,
      serviceRate: this.serviceFee,
      bio: this.bio,
    };
    console.log(rateData, 'consoling the rate data');

    this.profileService.sendRateBioLanguage(rateData).subscribe({
      next: (response) => {
        console.log('Rate and bio data submitted successfully:', response);
        this.router.navigate(['freelancer/create-account-location']);
        // Handle success (e.g., show a success message or redirect)
      },
      error: (error) => {
        console.error('Error submitting rate and bio data:', error);
      },
    });
  }
}
