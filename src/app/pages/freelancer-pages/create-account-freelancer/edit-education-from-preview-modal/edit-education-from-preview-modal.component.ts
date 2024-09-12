import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Education } from '../../../../shared/types/interfaces/education';

@Component({
  selector: 'app-edit-education-from-preview-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-education-from-preview-modal.component.html',
  styleUrl: './edit-education-from-preview-modal.component.scss',
})
export class EditEducationFromPreviewModalComponent {
  @Output() educationUpdate: EventEmitter<Education[]> = new EventEmitter();
  @Output() cancelChanges: EventEmitter<void> = new EventEmitter();

  isEducationModalOpen = false;
  isEditing: boolean = false;
  educations: Education[] = [];
  editedEducation: Education = {} as Education;
  editIndex: number = -1;
  private originalEducations: Education[] = [];

  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years: string[] = Array.from(
    { length: 50 },
    (_, i) => `${new Date().getFullYear() - i}`
  );

  openModal() {
    this.isEducationModalOpen = true;
    this.originalEducations = [...this.educations];
  }

  closeEducationModal() {
    this.isEducationModalOpen = false;
    this.resetForm();
  }

  startEditingEducation(index: number) {
    this.isEditing = true;
    this.editIndex = index;
    this.editedEducation = { ...this.educations[index] };
  }

  saveEditedEducation() {
    if (this.editIndex > -1) {
      this.educations = this.educations.map((edu, index) =>
        index === this.editIndex ? this.editedEducation : edu
      );
    }
    this.cancelEditing();
  }

  cancelEditing() {
    this.isEditing = false;
    this.resetForm();
  }

  saveAllChanges() {
    this.educationUpdate.emit(this.educations);
    this.closeEducationModal();
  }

  cancelEdit() {
    this.educations = [...this.originalEducations];
    this.cancelChanges.emit();
    this.closeEducationModal();
  }

  deleteEducation(index: number) {
    this.educations.splice(index, 1);
    this.educationUpdate.emit(this.educations);
  }

  resetForm() {
    this.editedEducation = this.getDefaultEducation();
    this.isEditing = false;
    this.editIndex = -1;
  }

  getDefaultEducation(): Education {
    return {
      school: '',
      degree: '',
      description: '',
      fieldOfStudy: '',
      fromMonth: '',
      fromYear: '',
      toMonth: '',
      toYear: '',
    };
  }
}
