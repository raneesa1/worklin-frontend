import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { roleService } from '../../../../shared/service/role.service';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { Experience } from '../../../../shared/types/interfaces/experience';

@Component({
  selector: 'app-add-experience-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-experience-modal.component.html',
  styleUrls: ['./add-experience-modal.component.scss'],
})
export class AddExperienceModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() experienceAdded = new EventEmitter<void>();
  isModalOpen = false;
  isCurrentlyWorking = false;
  dateError = false;

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

  constructor(
    private profileManagementService: ProfileManagementService,
    private roleService: roleService
  ) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.close.emit();
  }

  save() {
    this.dateError = false;

    if (this.validateFields()) {
      const startDate = new Date(
        `${this.experience.startMonth} 1, ${this.experience.startYear}`
      );
      const endDate = new Date(
        `${this.experience.endMonth} 1, ${this.experience.endYear}`
      );

      if (!this.isCurrentlyWorking && endDate < startDate) {
        this.dateError = true;
        return;
      }

      this.experience.userId = this.roleService.getUserId();
      this.experience.startDate = `${this.experience.startMonth} ${this.experience.startYear}`;
      this.experience.endDate = this.isCurrentlyWorking
        ? ''
        : `${this.experience.endMonth} ${this.experience.endYear}`;

      console.log(
        this.experience,
        'consoling the experience before sending req to add experience'
      );
      this.profileManagementService
        .sendExperienceData(this.experience)
        .subscribe(() => {
          this.experienceAdded.emit();
          this.closeModal();
        });
    }
  }

  toggleCurrentlyWorking(event: any) {
    this.isCurrentlyWorking = event.target.checked;
  }

  validateFields(): boolean {
    const requiredFields = [
      'title',
      'company',
      'country',
      'startMonth',
      'startYear',
      'description',
    ];
    if (!this.isCurrentlyWorking) {
      requiredFields.push('endMonth', 'endYear');
    }

    for (const field of requiredFields) {
      if (!this.experience[field as keyof Experience]) {
        return false;
      }
    }
    return true;
  }
}
