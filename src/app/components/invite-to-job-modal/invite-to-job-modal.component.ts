import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jobManagementService } from '../../pages/client-pages/job-management/service/job-management.service';
import { roleService } from '../../shared/service/role.service';
import { FormsModule } from '@angular/forms';
import { IInviteFreelancer } from '../../pages/client-pages/job-management/interfaces/jobPost';
import { FreelancerEntity } from '../../shared/types/FreelancerEntity';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invite-to-job-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invite-to-job-modal.component.html',
  styleUrl: './invite-to-job-modal.component.scss',
})
export class InviteToJobModalComponent {
  @Input() freelancer: FreelancerEntity | null = null;
  @Output() close = new EventEmitter<void>();
  @Input() jobId: string | null = null;
  private subscription: Subscription | null = null; // Subscription management

  constructor(
    private jobManagementService: jobManagementService,
    private roleService: roleService // Inject RoleService
  ) {}

  message: string = `
Hello!

I'd like to invite you to take a look at the job I've posted. Please submit a proposal if you're available and interested.

 `;
  closeModal() {
    this.close.emit(); // Emit an event to notify that the modal should be closed
  }

  onSendInvitation() {
    if (this.freelancer?._id && this.jobId) {
      const clientId = this.roleService.getUserId();
      const clientName = this.roleService.getFirstName();
      console.log(clientName, 'consoling the client first name'); // Get client ID from token
      const invitationData: IInviteFreelancer = {
        clientName: clientName as string,
        freelancerId: this.freelancer._id,
        clientId: clientId,
        jobId: this.jobId,
        description: this.message.trim(),
      };
      console.log(invitationData, 'consoling the invitation data');

      this.subscription = this.jobManagementService
        .sendInvitation(invitationData)
        .subscribe(
          (response) => {
            console.log('Invitation sent successfully:', response);
            this.closeModal();
          },
          (error) => {
            console.error('Error sending invitation:', error);
          }
        );
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up subscription
    }
  }
}
