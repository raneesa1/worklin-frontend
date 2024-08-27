import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-language-from-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-language-from-preview-modal.component.html',
  styleUrl: './edit-language-from-preview-modal.component.scss',
})
export class EditLanguageFromPreviewModalComponent {
  @Input() isModalOpen = false;
  @Input() languages: { language: string; proficiency: string }[] = [];
  englishProficiency: string = 'Fluent'; // Default value; adjust as needed

  // Open the modal
  openModal() {
    this.isModalOpen = true;
  }

  // Close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Add a new language input
  addLanguage() {
    this.languages.push({ language: '', proficiency: '' });
  }

  // Remove a language input
  removeLanguage(index: number) {
    this.languages.splice(index, 1);
  }

  // Save changes and close the modal
  saveLanguages() {
    // Implement save logic here
    this.closeModal();
  }
}
