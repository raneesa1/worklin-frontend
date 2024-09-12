import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { JoblistViewMoreModalComponent } from '../joblist-view-more-modal/joblist-view-more-modal.component';
import { IJobPost } from '../interfaces/jobPost';
import { jobManagementService } from '../service/job-management.service';
import { NavbarAfterLoginComponent } from '../../../../shared/components/navbar-after-login/navbar-after-login.component';
import { roleService } from '../../../../shared/service/role.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-my-jobs',
  standalone: true,
  imports: [
    CommonModule,
    NavbarAfterLoginComponent,
    JoblistViewMoreModalComponent,
  ],
  templateUrl: './list-my-jobs.component.html',
  styleUrls: ['./list-my-jobs.component.scss'],
})
export class ListMyJobsComponent implements OnInit, OnDestroy {
  jobPosts: IJobPost[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private jobService: jobManagementService,
    private roleService: roleService
  ) {}

  ngOnInit(): void {
    this.fetchJobPosts();
    console.log(this.jobPosts, 'consoling the job post');
  }

  fetchJobPosts(): void {
    const clientId = this.roleService.getUserId(); // Fetch the user ID
    this.jobService
      .getJobPostsByUserId(clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.jobPosts = response.jobPosts; // Extract jobPosts from the response
          console.log(this.jobPosts, 'Fetched job posts');
        },
        error: (err) => {
          console.error('Error fetching job posts', err);
        },
      });
  }
  timeAgo(date?: Date): string {
    if (!date) return 'Date not available'; // Handle undefined date

    const seconds = Math.floor((+new Date() - +new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
  ngOnDestroy(): void {
    // Emit a value to signal that the component is being destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}
