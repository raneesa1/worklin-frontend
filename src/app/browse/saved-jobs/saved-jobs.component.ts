import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { IJobPost } from '../../job-management/interfaces/jobPost';
import { BrowseService } from '../service/browse.service';
import { CommonModule } from '@angular/common';
import { roleService } from '../../../role.service';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.scss',
})
export class SavedJobsComponent implements OnInit {
  jobPosts: IJobPost[] = [];
  showMore: boolean[] = [];
  savedJobs: boolean[] = [];
  savedJobsSet: Set<string> = new Set();

  constructor(
    private browseService: BrowseService,
    private roleService: roleService
  ) {}

  ngOnInit(): void {
    console.log('SavedJobsComponent initialized');

    // Retrieve the freelancer ID from the roleService
    const freelancerId = this.roleService.getUserId();
    console.log('Freelancer ID:', freelancerId);

    // Fetch saved jobs using the freelancer ID
    this.browseService.getSavedJobs(freelancerId).subscribe({
      next: (response: any) => {
        this.jobPosts = response;
        console.log(this.jobPosts, 'Saved job posts retrieved');
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

    const isFavorite = !job.isFavorite;
    job.isFavorite = isFavorite;

    const freelancerId = this.roleService.getUserId();

    if (isFavorite) {
      // Send job data to the backend when saving to favorites
      this.browseService.saveJobToFavorite(job, freelancerId).subscribe({
        next: (response) => {
          console.log('Job saved:', response);
          if (job._id) {
            this.savedJobsSet.add(job._id);
          }
        },
        error: (error) => {
          console.error('Error saving job:', error);
          job.isFavorite = false;
          if (job._id) {
            this.savedJobsSet.delete(job._id);
          }
        },
      });
    } else {
      // Send only the job ID to the backend when removing from favorites
      this.browseService
        .removeJobFromFavorite(job._id || '', freelancerId)
        .subscribe({
          next: (response) => {
            console.log('Job removed:', response);
            if (job._id) {
              this.savedJobsSet.delete(job._id);
            }
          },
          error: (error) => {
            console.error('Error removing job:', error);
            job.isFavorite = true;
            if (job._id) {
              this.savedJobsSet.add(job._id);
            }
          },
        });
    }
  }
}
