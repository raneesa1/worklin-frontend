import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InviteFreelancersComponent } from '../invite-freelancers/invite-freelancers.component';
import { ReviewApplicationsComponent } from '../review-applications/review-applications.component';
import { ViewJobPostComponent } from '../view-job-post/view-job-post.component';
import { JobPostHiresComponent } from '../job-post-hires/job-post-hires.component';
import { ActivatedRoute, Router } from '@angular/router';
import { jobManagementService } from '../service/job-management.service';
import { IApplication, IJobPost } from '../interfaces/jobPost';
import { NavbarAfterLoginComponent } from '../../../../shared/components/navbar-after-login/navbar-after-login.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-manage-job-post',
  standalone: true,
  imports: [
    CommonModule,
    InviteFreelancersComponent,
    NavbarAfterLoginComponent,
    ReviewApplicationsComponent,
    ViewJobPostComponent,
    JobPostHiresComponent,
  ],
  templateUrl: './manage-job-post.component.html',
  styleUrl: './manage-job-post.component.scss',
})
export class ManageJobPostComponent implements OnInit {
  activeStep: string = 'view-job-post'; // Default step
  jobPostId!: string;
  jobData: IJobPost | null = null;
  applications: IApplication[] = [];
  private destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private jobService: jobManagementService,
    private router: Router // Inject your service
  ) {}

  setActiveStep(step: string) {
    this.activeStep = step;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step: this.activeStep },
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.jobPostId = params['id'];
        this.activeStep = params['step'] || 'view-job-post'; // Default to 'view-job-post' if no step is found
        this.fetchJobData();
      });
  }
  fetchJobData(): void {
    console.log(this.jobPostId, 'consoling the job post id');

    this.jobService
      .getJobPostById(this.jobPostId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          if (response && response.jobPosts) {
            this.jobData = response.jobPosts;
            this.applications = this.jobData?.applications || [];
            console.log(this.jobData, 'consoling the job data');
          } else {
            console.error('No job post data found in the response.');
          }
        },
        (error) => {
          console.error('Error fetching job post:', error);
        }
      );
  }
  getApplicationsCount(): number {
    return this.applications.length; // Compute the length of the applications array
  }
  ngOnDestroy(): void {
    // Emit a value to signal that the component is being destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}
