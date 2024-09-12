import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { roleService } from '../../../../shared/service/role.service';
import { consumerMarkDirty } from '@angular/core/primitives/signals';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { Education } from '../../../../shared/types/interfaces/education';
interface EducationErrors {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  fromDate?: string;
  toDate?: string;
  description?: string;
}

@Component({
  selector: 'app-add-education-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-education-modal.component.html',
  styleUrls: ['./add-education-modal.component.scss'],
})
export class AddEducationModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Education>();

  school: string = '';
  degree: string = '';
  fieldOfStudy: string = '';
  fromMonth: string = '';
  fromYear: string = '';
  toMonth: string = '';
  toYear: string = '';
  description: string = '';

  errors: EducationErrors = {};
  dirtyFields: { [key: string]: boolean } = {};
  constructor(
    private profileManagementService: ProfileManagementService,
    private roleService: roleService
  ) {}
  // Handle form submission
  handleSubmit() {
    this.errors = {}; // Clear previous errors

    if (this.validateForm()) {
      const userId = this.roleService.getUserId();
      const educationData = {
        userId: userId,
        school: this.school,
        degree: this.degree,
        fieldOfStudy: this.fieldOfStudy,
        fromMonth: this.fromMonth,
        fromYear: this.fromYear,
        toMonth: this.toMonth,
        toYear: this.toYear,
        description: this.description,
      };
      this.profileManagementService.addEducation(educationData).subscribe({
        next: (response) => {
          // Handle success response
          console.log('Education data saved successfully:', response);
          this.save.emit(educationData);
          this.closeModal();
        },
        error: (error) => {
          // Handle error response
          console.error('Error saving education data:', error);
        },
      });

      console.log('Form Data:', educationData);
      this.save.emit(educationData);
      this.closeModal();
    }
  }

  // Close the modal
  closeModal() {
    this.close.emit();
  }

  // Simple validation for required fields
  validateForm(): boolean {
    let isValid = true;

    // Ensure that all fields have been provided
    if (this.school.trim() === '') {
      this.errors.school = 'School is required.';
      isValid = false;
    }
    if (this.description.trim() === '') {
      this.errors.description = 'description is required.';
      isValid = false;
    }
    if (this.degree.trim() === '') {
      this.errors.degree = 'Degree is required.';
      isValid = false;
    }
    if (this.fieldOfStudy.trim() === '') {
      this.errors.fieldOfStudy = 'Field of Study is required.';
      isValid = false;
    }
    if (this.fromMonth.trim() === '' || this.fromYear.trim() === '') {
      this.errors.fromDate = 'Start date is required.';
      isValid = false;
    }
    if (this.toMonth.trim() === '' || this.toYear.trim() === '') {
      this.errors.toDate = 'End date is required.';
      isValid = false;
    }

    // Check if endDate is before startDate
    if (isValid && this.toMonth && this.toYear) {
      const fromDate = new Date(`${this.fromMonth} ${this.fromYear}`);
      const toDate = new Date(`${this.toMonth} ${this.toYear}`);
      if (toDate < fromDate) {
        this.errors.toDate = 'End date cannot be before start date.';
        isValid = false;
      }
    }

    return isValid;
  }
}
