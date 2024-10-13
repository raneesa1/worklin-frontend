import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';

@Component({
  selector: 'app-job-post-hires',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-post-hires.component.html',
  styleUrl: './job-post-hires.component.scss',
})
export class JobPostHiresComponent implements OnInit, OnDestroy {
  jobPostId: string = '';
  hires: FreelancerEntity[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileManagementService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.jobPostId = params['id'];
        if (this.jobPostId) {
          this.fetchHires();
        } else {
          console.error('No job post ID found in URL');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  fetchHires(): void {
    this.profileService
      .getHiredFreelancers(this.jobPostId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (hires: any[]) => {
          // Use `any[]` because the structure is nested
          console.log(hires, 'Raw response');

          // Extracting freelancer objects from the response
          this.hires = hires.map((hire) => hire.freelancer);

          console.log('Hired freelancers:', this.hires);
        },
        (error) => {
          console.error('Error fetching hired freelancers:', error);
        }
      );
  }

  viewProfile(freelancerId: string): void {
    console.log('Navigating to applicant profile with ID:', freelancerId);
    this.router.navigate(['/client/applicant', freelancerId]);
  }
}
