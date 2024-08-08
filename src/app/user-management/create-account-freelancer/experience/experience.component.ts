import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddExperienceModalComponent } from '../add-experience-modal/add-experience-modal.component';
import { Experience } from '../../interfaces/experience';
import { ProfileManagementService } from '../../service/profile-management.service';
import { roleService } from '../../../../role.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RouterModule, CommonModule, AddExperienceModalComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit {
  isModalOpen = false;
  experiences: Experience[] = [];
  userId: string | null = null;

  constructor(
    private profileService: ProfileManagementService,
    private roleService: roleService
  ) {}

  ngOnInit(): void {
    this.userId = this.roleService.getUserId(); // Get user ID from role service
    if (this.userId) {
      this.fetchExperiences();
    } else {
      console.error('User ID is not available');
    }
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  fetchExperiences(): void {
    if (this.userId) {
      this.profileService.getExperience(this.userId).subscribe(
        (data: Experience[]) => {
          this.experiences = data;
          console.log(this.experiences, 'consoling the experience');
        },
        (error) => {
          console.error('Error fetching experiences:', error);
        }
      );
    }
  }
  loadExperiences() {
    this.fetchExperiences();
  }

  deleteExperience(experienceId: string | undefined): void {
    if (experienceId) {
      this.profileService.deleteExperience(experienceId).subscribe(
        () => {
          this.experiences = this.experiences.filter(
            (exp) => exp._id !== experienceId
          );
          console.log('Experience deleted successfully');
        },
        (error) => {
          console.error('Error deleting experience:', error);
        }
      );
    }
  }
}
