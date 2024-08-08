import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Education } from '../../interfaces/education';

@Component({
  selector: 'app-add-education-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-education-modal.component.html',
  styleUrl: './add-education-modal.component.scss',
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

  // Handle form submission
  handleSubmit() {
    if (this.validateForm()) {
      this.save.emit({
        school: this.school,
        degree: this.degree,
        fieldOfStudy: this.fieldOfStudy,
        fromMonth: this.fromMonth,
        fromYear: this.fromYear,
        toMonth: this.toMonth,
        toYear: this.toYear,
        description: this.description,
      });
      this.closeModal();
    }
  }

  // Close the modal
  closeModal() {
    this.close.emit();
  }

  // Simple validation for required fields
  validateForm(): boolean {
    // Ensure that all fields have been provided
    return (
      this.school.trim() !== '' &&
      this.degree.trim() !== '' &&
      this.fieldOfStudy.trim() !== '' &&
      this.fromMonth.trim() !== '' &&
      this.fromYear.trim() !== '' &&
      this.toMonth.trim() !== '' &&
      this.toYear.trim() !== ''
    );
  }
}
