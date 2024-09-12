import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Experience } from '../../../../shared/types/interfaces/experience';


@Component({
  selector: 'app-edit-experience-from-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-experience-from-preview-modal.component.html',
  styleUrl: './edit-experience-from-preview-modal.component.scss',
})
export class EditExperienceFromPreviewModalComponent {
  @Output() saveChanges: EventEmitter<Experience[]> = new EventEmitter();
  @Output() cancelChanges: EventEmitter<void> = new EventEmitter();

  isExperienceModalOpen = false;
  isEditing = false;
  experiences: Experience[] = []; // Replace with your experience type
  editedExperience: Experience = {} as Experience; // Replace with your experience type
  countries = ['USA', 'Canada', 'UK', 'Australia']; // Example countries
  months = [
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
  years = [2020, 2021, 2022, 2023, 2024]; // Example years
  dateError = false;
  editIndex: number = -1;
  private originalExperiences: Experience[] = []; // Add this property to store the original state

  openModal() {
    this.isExperienceModalOpen = true;
    // Save the original state when the modal opens
    this.originalExperiences = [...this.experiences];
  }

  closeExperienceModal() {
    this.isExperienceModalOpen = false;
    this.cancelChanges.emit();
  }

  startEditingExperience(index: number) {
    this.isEditing = true;
    this.editIndex = index;
    this.editedExperience = { ...this.experiences[index] };
    // Set isCurrentlyWorking based on endDate
    this.editedExperience.isCurrentlyWorking = !this.editedExperience.endDate;
  }

  saveEditedExperience() {
    if (this.editIndex > -1) {
      this.experiences[this.editIndex] = this.editedExperience;
    }
    this.cancelEditing();
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedExperience = {} as Experience;
    this.editIndex = -1;
  }

  deleteExperience(index: number) {
    this.experiences.splice(index, 1);
  }

  isCurrentlyWorking(experience: Experience): boolean {
    return !experience.endDate;
  }

  saveAllChanges() {
    this.saveChanges.emit(this.experiences);
    this.closeExperienceModal();
  }

  cancelAllChanges() {
    // Restore the original state
    this.experiences = [...this.originalExperiences];
    this.cancelChanges.emit();
    this.closeExperienceModal();
  }

  toggleCurrentlyWorking(event: any) {
    this.editedExperience.isCurrentlyWorking = event.target.checked;
    if (this.editedExperience.isCurrentlyWorking) {
      this.editedExperience.endMonth = '';
      this.editedExperience.endYear = '';
    }
  }
}
