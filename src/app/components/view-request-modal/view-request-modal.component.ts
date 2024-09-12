import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-request-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-request-modal.component.html',
  styleUrl: './view-request-modal.component.scss',
})
export class ViewRequestModalComponent {
  @Input() clientName: string | null = null;
  @Input() message: string | null = null;
  @Input() jobId: string | null | undefined = null;
  @Output() close = new EventEmitter<void>();
  @Output() accept = new EventEmitter<{ jobId: string; status: string }>();
  @Output() decline = new EventEmitter<{ jobId: string; status: string }>();

  IsInviteSelected: boolean = true;

  constructor() {
    console.log('ViewRequestModalComponent initialized');
    console.log('Initial jobId:', this.jobId);
  }

  ngOnInit() {
    console.log('Component initialized with data:');
    console.log('Client Name:', this.clientName);
    console.log('Message:', this.message);
    console.log('Job ID:', this.jobId);
  }

  acceptInvite() {
    console.log('acceptInvite called');
    console.log('Current jobId:', this.jobId);
    if (this.jobId) {
      console.log('Accepting invite for job:', this.jobId);
      this.accept.emit({ jobId: this.jobId, status: 'accepted' });
    } else {
      console.error('No job ID available for accepting invite');
    }
    this.closeInviteModal();
  }

  declineInvite() {
    console.log('declineInvite called');
    console.log('Current jobId:', this.jobId);
    if (this.jobId) {
      console.log('Declining invite for job:', this.jobId);
      this.decline.emit({ jobId: this.jobId, status: 'rejected' });
    } else {
      console.error('No job ID available for declining invite');
    }
    this.closeInviteModal();
  }

  closeInviteModal() {
    console.log('Closing invite modal');
    this.close.emit();
    this.IsInviteSelected = false;
  }
}
