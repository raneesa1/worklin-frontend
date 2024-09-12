import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
import { FreelancerEntity } from '../../shared/types/FreelancerEntity';
import { jobManagementService } from '../../pages/client-pages/job-management/service/job-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-invited-freelancer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-invited-freelancer.component.html',
  styleUrl: './view-invited-freelancer.component.scss',
})
export class ViewInvitedFreelancerComponent implements OnInit {
  @Input() jobId: string | null = null; // Job ID passed from parent component
  invitedFreelancers: any[] = []; // Array to hold the invited freelancers
  private subscription: Subscription | null = null; // Subscription management

  constructor(private jobManagementService: jobManagementService) {}

  ngOnInit(): void {
    if (this.jobId) {
      console.log(this.jobId, 'consoling the job id before sending to backend');
      // Fetch invited freelancers from the backend
      this.subscription = this.jobManagementService
        .getInvitedFreelancers(this.jobId)
        .subscribe(
          (data) => {
            this.invitedFreelancers = data;
            console.log(this.invitedFreelancers);
            console.log(
              'Fetched invited freelancers:',
              this.invitedFreelancers
            );
          },
          (error) => {
            console.error('Error fetching invited freelancers:', error);
          }
        );
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up subscription
    }
  }
}
