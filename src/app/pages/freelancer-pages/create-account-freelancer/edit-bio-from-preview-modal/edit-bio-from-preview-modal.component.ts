import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoUploadModalComponent } from '../photo-upload-modal/photo-upload-modal.component';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';

@Component({
  selector: 'app-edit-bio-from-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoUploadModalComponent],
  templateUrl: './edit-bio-from-preview-modal.component.html',
  styleUrl: './edit-bio-from-preview-modal.component.scss',
})
export class EditBioFromPreviewModalComponent {
  @Output() modalClose = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<FreelancerEntity>();
  isModalOpen = false;
  freelancer: FreelancerEntity = {} as FreelancerEntity;
  updatedFreelancer: FreelancerEntity = { ...this.freelancer };

  closeModal() {
    this.isModalOpen = false;
    this.modalClose.emit();
  }

  saveProfile() {
    this.profileUpdated.emit(this.updatedFreelancer);
    this.freelancer = { ...this.updatedFreelancer }; // Update the original freelancer
    this.closeModal();
  }

  openModal() {
    this.updatedFreelancer = { ...this.freelancer }; // Copy the freelancer data
    this.isModalOpen = true;
  }

  onImageUploaded(imageUrl: string) {
    this.updatedFreelancer.picture = imageUrl;
  }
}
