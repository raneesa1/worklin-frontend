import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IInviteFreelancer, IJobPost } from '../interfaces/jobPost';
import { jobManagementService } from '../service/job-management.service';
import { InviteToJobModalComponent } from '../../../../components/invite-to-job-modal/invite-to-job-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarAfterLoginComponent } from '../../../../shared/components/navbar-after-login/navbar-after-login.component';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';
import { ViewInvitedFreelancerComponent } from '../../../../components/view-invited-freelancer/view-invited-freelancer.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-invite-freelancers',
  standalone: true,
  imports: [
    CommonModule,
    NavbarAfterLoginComponent,
    InviteToJobModalComponent,
    ViewInvitedFreelancerComponent,
  ],
  templateUrl: './invite-freelancers.component.html',
  styleUrl: './invite-freelancers.component.scss',
})
export class InviteFreelancersComponent {
  @Input() jobData!: IJobPost | null;
  freelancers: FreelancerEntity[] = [];
  inviteModalOpen = false;
  selectedFreelancer: FreelancerEntity | null = null;
  invitedFreelancers: FreelancerEntity[] = [];
  jobId: string | null = null;
  openInvitedFreelancer = false;
  showAllFreelancers = true;
  private destroy$ = new Subject<void>();

  constructor(
    private jobManagementService: jobManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.jobId = params['id'];
      });

    if (this.jobData && this.jobData.skills) {
      const skillIds = this.jobData.skills
        .map((skill) => skill._id)
        .filter((id): id is string => id !== undefined);
      console.log(skillIds, 'consoling the skills id');
      if (skillIds.length > 0) {
        this.jobManagementService
          .getFreelancersBySkills(skillIds)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
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
  openInviteModal(freelancer: FreelancerEntity) {
    this.selectedFreelancer = freelancer;
    this.inviteModalOpen = true;
  }

  closeInviteModal() {
    this.inviteModalOpen = false;
    this.selectedFreelancer = null;
  }

  // Show invited freelancers and hide all freelancers
  displayInvitedFreelancer() {
    this.showAllFreelancers = false;
    this.openInvitedFreelancer = true;
  }

  // Close invited freelancers view
  closeInviteFreelancer() {
    this.openInvitedFreelancer = false;
  }
  hireFreelancer(freelancer: FreelancerEntity) {
    // Navigate to the set-offer page with freelancer data
    this.router.navigate(['client/set-offer'], {
      state: { freelancer: freelancer },
    });
  }

  // Show all freelancers and hide invited freelancers
  displayAllFreelancers() {
    this.showAllFreelancers = true;
    this.openInvitedFreelancer = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
