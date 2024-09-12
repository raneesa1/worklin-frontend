import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';

@Component({
  selector: 'app-edit-rate-from-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-rate-from-preview-modal.component.html',
  styleUrl: './edit-rate-from-preview-modal.component.scss',
})
export class EditRateFromPreviewModalComponent {
  isRateModalOpen = false;
  @Output() freelancerUpdated = new EventEmitter<FreelancerEntity>();
  freelancer: FreelancerEntity = {} as FreelancerEntity;
  updatedFreelancer: FreelancerEntity = { ...this.freelancer };

  hourlyRate: number | null = null;
  serviceFee: number | 0 = 0;
  rateError: boolean = false;

  // Function to show the modal
  openEditRateModal() {
    this.isRateModalOpen = true;
    this.hourlyRate = this.freelancer.hourlyRate ?? null;
    this.serviceFee = this.freelancer.serviceRate ?? null;
  }

  // Function to close the modal
  closeEditRateModal() {
    this.isRateModalOpen = false;
  }

  // Function to validate input
  validateInput() {
    this.rateError = this.hourlyRate === null || this.hourlyRate <= 0;
  }

  // Function to submit rates
  submitRates() {
    if (this.hourlyRate !== null && this.hourlyRate > 0) {
      // Update the freelancer object
      this.freelancer.hourlyRate = this.hourlyRate;
      this.freelancer.serviceRate = this.serviceFee;

      // Emit the updated freelancer object
      this.freelancerUpdated.emit(this.freelancer);

      // Close the modal
      this.closeEditRateModal();
    } else {
      this.rateError = true;
    }
  }
}
