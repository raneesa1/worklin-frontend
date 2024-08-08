import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FreelancerPagetwoComponent } from '../freelancer-pagetwo/freelancer-pagetwo.component';
import { BrowseModule } from '../../browse/browse.module';
import { CommonModule } from '@angular/common';
import { ProfileManagementService } from '../service/profile-management.service';

@Component({
  selector: 'app-freelancer-page-one',
  standalone: true,
  imports: [
    RouterOutlet,
    FreelancerPagetwoComponent,
    BrowseModule,
    CommonModule,
  ],
  templateUrl: './freelancer-page-one.component.html',
  styleUrl: './freelancer-page-one.component.scss',
})
export class FreelancerPageOneComponent {
  selected: boolean = false;
  experienceLevel: string | null = null;
  selectedGoal: string | null = null;

  constructor(private profileService: ProfileManagementService) {}
  selectExperience(level: string) {
    this.experienceLevel = level;
    this.selected = true;
    console.log(`Experience level selected: ${this.experienceLevel}`);
  }


  handleGoalSelected(goal: string) {
    this.selectedGoal = goal;

    console.log(`Goal received in page two: ${this.selectedGoal}`);
  }
  submitData() {
    if (this.selectedGoal && this.experienceLevel) {
      const profileData = {
        goal: this.selectedGoal,
        experience: this.experienceLevel,
      };

      this.profileService.sendProfileData(profileData).subscribe(
        (response) => {
          console.log('Profile data sent successfully:', response);
        },
        (error) => {
          console.error('Error sending profile data:', error);
        }
      );
    } else {
      console.error('Goal or Experience is not selected.');
    }
  }
}