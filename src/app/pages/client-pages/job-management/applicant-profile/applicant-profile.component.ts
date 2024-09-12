import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { roleService } from '../../../../shared/service/role.service';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-applicant-profile',
  standalone: true,
  imports: [],
  templateUrl: './applicant-profile.component.html',
  styleUrl: './applicant-profile.component.scss',
})
export class ApplicantProfileComponent implements OnInit, OnDestroy {
  freelancer: FreelancerEntity = {
    firstName: '',
    email: '',
    phoneNumber: 0,
    accountType: '',
    subCategory: [],
    bio: '',
    role: '',
    picture: '',
    country: '',
    isBlocked: false,
    resume: '',
    category: [],
    experience: [],
    education: [],
    dob: '',
    languages: [],
    isProfileCompleted: false,
    hourlyRate: 0,
    serviceRate: 0,
    freelancedBefore: '',
    freelancingGoal: '',
    skill: [],
  };
  loading: boolean = true;
  error: string | null = null;
  currentTime: string = '';
  private destroy$ = new Subject<void>();
  private timeIntervalId: any;

  constructor(
    private profileService: ProfileManagementService,
    private roleService: roleService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const freelancerId = params['id'];
        console.log(freelancerId, '==================');
        if (freelancerId) {
          console.log(freelancerId, 'consoling the freelancer id=========>>>');
          this.loadFreelancerProfile(freelancerId);
        } else {
          this.error = 'No freelancer ID provided';
          this.loading = false;
        }
      });
    this.updateCurrentTime();
    this.timeIntervalId = setInterval(() => this.updateCurrentTime(), 60000); // Update time every minute
  }

  loadFreelancerProfile(freelancerId: string) {
    this.loading = true;
    this.profileService
      .getFreelancerProfile(freelancerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.freelancer = { ...this.freelancer, ...data };
          console.log(this.freelancer);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load freelancer profile';
          this.loading = false;
          console.error('Error loading freelancer profile:', err);
        },
      });
  }

  updateCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  ngOnDestroy() {
    // Emit a value to signal that the component is being destroyed
    this.destroy$.next();
    this.destroy$.complete();
    // Clear the interval to stop updating the time
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
  }
}
