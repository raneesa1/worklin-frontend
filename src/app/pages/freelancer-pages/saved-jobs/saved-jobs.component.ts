import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { roleService } from '../../../shared/service/role.service';
import { IJobPost } from '../../client-pages/job-management/interfaces/jobPost';
import { BrowseService } from '../../../shared/service/browse.service';
import {
  ISavedJobs,
  savedJobStatus,
} from '../../../shared/types/interfaces/saveJob';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.scss',
})
export class SavedJobsComponent implements OnInit {
  jobPosts: ISavedJobs[] = [];
  showMore: boolean[] = [];
  savedJobs: boolean[] = [];
  savedJobsSet: Set<string> = new Set();

  constructor(
    private browseService: BrowseService,
    private roleService: roleService
  ) {}

  ngOnInit(): void {
    console.log('SavedJobsComponent initialized');

    const freelancerId = this.roleService.getUserId();
    console.log('Freelancer ID:', freelancerId);

    this.fetchSavedJobs(freelancerId);
  }

  fetchSavedJobs(freelancerId: string): void {
    this.browseService.getSavedJobs(freelancerId).subscribe({
      next: (response: ISavedJobs[]) => {
        this.jobPosts = response;
        console.log('Saved job posts retrieved:', this.jobPosts);
        this.showMore = new Array(this.jobPosts.length).fill(false);
        this.savedJobsSet = new Set(this.jobPosts.map((job) => job._id || ''));
      },
      error: (error) => {
        console.error('Error fetching saved jobs:', error);
      },
    });
  }

  toggleDetails(index: number): void {
    this.showMore[index] = !this.showMore[index];
  }

  toggleFavorite(event: Event, job: IJobPost): void {
    event.stopPropagation();

    const freelancerId = this.roleService.getUserId();
    const jobData: ISavedJobs = {
      jobId: job._id || '',
      freelancerId: freelancerId,
      clientId: job.clientId || '',
      title: job.title || '',
      description: job.description || '',
      duration: job.duration || '',
      experience: job.experience || '',
      skills: job.skills.map((skill) => skill.name),
      priceFrom: job.priceFrom || 0,
      priceTo: job.priceTo || 0,
      rate: job.rate || '',
      createdAt: new Date(),
      isActive: true,
      hires: job.hires?.length || 0,
      status: this.mapJobStatus(job.status),
      applications: job.applications?.length || 0,
      location: job.location || '',
    };

    const action = this.savedJobsSet.has(job._id || '') ? 'unsave' : 'save';

    this.browseService.toggleSavedJob(jobData, action).subscribe({
      next: (response) => {
        console.log(`Job ${action}d:`, response);
        if (action === 'save') {
          this.savedJobsSet.add(job._id || '');
        } else {
          this.savedJobsSet.delete(job._id || '');
        }
        // Refresh the saved jobs list
        this.fetchSavedJobs(freelancerId);
      },
      error: (error) => {
        console.error(`Error ${action}ing job:`, error);
      },
    });
  }

  private mapJobStatus(status: string | undefined): savedJobStatus {
    switch (status) {
      case 'active':
        return savedJobStatus.active;
      case 'stopped':
        return savedJobStatus.stopped;
      case 'draft':
        return savedJobStatus.draft;
      default:
        return savedJobStatus.active; // Default to active if status is undefined or not recognized
    }
  }
}
