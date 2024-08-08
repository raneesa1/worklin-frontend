import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileManagementService } from '../../service/profile-management.service';
import { Experience } from '../../interfaces/experience';
import { roleService } from '../../../../role.service';

@Component({
  selector: 'app-add-experience-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-experience-modal.component.html',
  styleUrl: './add-experience-modal.component.scss',
})
export class AddExperienceModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() experienceAdded = new EventEmitter<void>();
  isModalOpen = false;
  isCurrentlyWorking = false;
  constructor(
    private profileManagementService: ProfileManagementService,
    private roleService: roleService
  ) {}
  experience: Experience = {
    userId: '',
    title: '',
    company: '',
    jobLocation: '',
    country: '',
    startDate: '',
    endDate: '',
    description: '',
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.close.emit();
  }
  save() {
    const userId = this.roleService.getUserId();

    // Format dates as strings
    const startDate = `${this.experience.startMonth} ${this.experience.startYear}`;
    const endDate = this.isCurrentlyWorking
      ? ''
      : `${this.experience.endMonth} ${this.experience.endYear}`;

    const experienceData: Experience = {
      ...this.experience,
      endDate: endDate,
      startDate: startDate,
      userId: userId || '',
    };
    console.log(
      experienceData,
      'consoling the data before sending to the backend'
    );

    // Send the data to the backend using the service
    this.profileManagementService.sendExperienceData(experienceData).subscribe(
      (response) => {
        console.log('Experience data saved successfully', response);
        this.experienceAdded.emit();
        this.close.emit();
      },
      (error) => {
        console.error('Error saving experience data', error);
        // Handle the error appropriately
      }
    );
  }

  toggleCurrentlyWorking(event: Event) {
    this.isCurrentlyWorking = (event.target as HTMLInputElement).checked;
  }
}
