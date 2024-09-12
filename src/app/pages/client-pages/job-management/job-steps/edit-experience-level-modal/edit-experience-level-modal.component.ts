import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-experience-level-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-experience-level-modal.component.html',
  styleUrl: './edit-experience-level-modal.component.scss',
})
export class EditExperienceLevelModalComponent {
  @Input() selectedExperience: string = '';
  @Output() experienceUpdated = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();
  isExperienceModalOpen = false;

  openModal() {
    this.isExperienceModalOpen = true;
  }

  close() {
    this.isExperienceModalOpen = false;
    this.closeModal.emit();
  }

  saveExperience() {
    if (this.selectedExperience) {
      this.experienceUpdated.emit(this.selectedExperience);
      this.close();
    }
  }
}
