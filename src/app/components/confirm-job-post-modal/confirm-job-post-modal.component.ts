import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirm-job-post-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirm-job-post-modal.component.html',
  styleUrl: './confirm-job-post-modal.component.scss',
})
export class ConfirmJobPostModalComponent {
  @Output() modalClosed = new EventEmitter<void>();
  @Output() jobPosted = new EventEmitter<void>();
  @Output() editJobPostClicked = new EventEmitter<void>();

  isModalOpen = true;

  closeModal() {
    this.isModalOpen = false;
    this.modalClosed.emit();
  }

  editJobPost() {
    this.isModalOpen = false;
    this.editJobPostClicked.emit(); // Emit an event when the edit job post button is clicked
  }

  postJob() {
    this.jobPosted.emit(); // Emit an event when the job is posted
  }
}
