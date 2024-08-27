import { Component } from '@angular/core';

@Component({
  selector: 'app-invite-to-job-modal',
  standalone: true,
  imports: [],
  templateUrl: './invite-to-job-modal.component.html',
  styleUrl: './invite-to-job-modal.component.scss',
})
export class InviteToJobModalComponent {
  isOpen = true;

  closeModal() {
    this.isOpen = false;
  }
}
