import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NavbarAfterLoginComponent } from '../../shared/components/navbar-after-login/navbar-after-login.component';
import { IJobPost } from '../interfaces/jobPost';
import { FreelancerEntity } from '../../browse/types/FreelancerEntity';
import { jobManagementService } from '../service/job-management.service';
import { InviteToJobModalComponent } from '../invite-to-job-modal/invite-to-job-modal.component';

@Component({
  selector: 'app-invite-freelancers',
  standalone: true,
  imports: [CommonModule, NavbarAfterLoginComponent, InviteToJobModalComponent],
  templateUrl: './invite-freelancers.component.html',
  styleUrl: './invite-freelancers.component.scss',
})
export class InviteFreelancersComponent {
  @Input() jobData!: IJobPost | null;
  freelancers: FreelancerEntity[] = [];
  inviteModalOpen = false;

  constructor(private jobManagementService: jobManagementService) {}

  ngOnInit(): void {
    if (this.jobData && this.jobData.skills) {
      const skillIds = this.jobData.skills
        .map((skill) => skill._id)
        .filter((id): id is string => id !== undefined);
      console.log(skillIds, 'consoling the skills id');
      if (skillIds.length > 0) {
        this.jobManagementService.getFreelancersBySkills(skillIds).subscribe(
          (data) => {
            console.log(data, 'consoling the data');
            this.freelancers = data;
          },
          (error) => {
            console.error('Error fetching freelancers:', error);
          }
        );
      }
    }
  }
  truncateBio(bio: string, limit: number): string {
    return bio.length > limit ? `${bio.slice(0, limit)}...` : bio;
  }
  openInviteModal() {
    this.inviteModalOpen = true;
  }
}
