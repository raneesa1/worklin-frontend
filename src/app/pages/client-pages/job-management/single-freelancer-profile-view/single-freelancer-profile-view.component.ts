import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarAfterLoginComponent } from '../../../../shared/components/navbar-after-login/navbar-after-login.component';
import { roleService } from '../../../../shared/service/role.service';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';

@Component({
  selector: 'app-single-freelancer-profile-view',
  standalone: true,
  imports: [NavbarAfterLoginComponent, CommonModule],
  templateUrl: './single-freelancer-profile-view.component.html',
  styleUrl: './single-freelancer-profile-view.component.scss',
})
export class SingleFreelancerProfileViewComponent {
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

  constructor(
    private profileService: ProfileManagementService,
    private roleService: roleService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const freelancerId = params.get('id');
      console.log(freelancerId, '==================');
      if (freelancerId) {
        this.loadFreelancerProfile(freelancerId);
      } else {
        this.error = 'No freelancer ID provided';
        this.loading = false;
      }
    });
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 60000); // Update time every minute
  }

  loadFreelancerProfile(freelancerId: string) {
    this.loading = true;
    this.profileService.getFreelancerProfile(freelancerId).subscribe({
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
}
