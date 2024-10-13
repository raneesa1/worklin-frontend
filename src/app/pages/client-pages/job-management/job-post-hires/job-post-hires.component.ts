import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IJobPost } from '../interfaces/jobPost';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';

@Component({
  selector: 'app-job-post-hires',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-post-hires.component.html',
  styleUrl: './job-post-hires.component.scss',
})
export class JobPostHiresComponent {
  @Input() jobData!: IJobPost | null;
  jobPostId: string = '';
  hires: FreelancerEntity[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private profileService: ProfileManagementService
  ) {}

  ngOnInit(): void {
    this.jobPostId = this.jobData?._id || '';
    this.fetchHires();
  }

  fetchHires(): void {
    this.profileService
      .getHiredFreelancers(this.jobPostId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          if (response && response.jobPosts) {
            this.hires = response.hires; // Changed from hire to hires
            console.log(response, 'consoling response data of hire');
          } else {
            console.error('No job hire data found in the response.');
          }
        },
        (error) => {
          console.error('Error fetching job hire:', error);
        }
      );
  }

  viewProfile(freelancerId: string): void {
    console.log('Navigating to applicant profile with ID:', freelancerId);
    this.router.navigate(['/client/applicant', freelancerId]);
  }
}
