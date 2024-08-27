import { Component, OnInit } from '@angular/core';
import { IJobPost } from '../../job-management/interfaces/jobPost';
import { BrowseService } from '../service/browse.service';
import { CommonModule } from '@angular/common';
import { JobDetailPageComponent } from '../job-detail-page/job-detail-page.component';
import { roleService } from '../../../role.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, JobDetailPageComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss',
})
export class JobListComponent implements OnInit {
  jobPosts: IJobPost[] = [];
  showMore: boolean[] = [];
  savedJobs: boolean[] = [];
  selectedJob: IJobPost | null = null;
  isClosing: boolean = false;
  savedJobsSet: Set<string> = new Set();
  constructor(
    private browseService: BrowseService,
    private roleService: roleService
  ) {}

  ngOnInit(): void {
    this.browseService.getJobPosts().subscribe((response: any) => {
      this.jobPosts = response.jobPost.map((job: IJobPost) => ({
        ...job,
        isFavorite: this.savedJobsSet.has(job._id || ''),
      }));
      console.log(this.jobPosts);
      this.showMore = new Array(this.jobPosts.length).fill(false);
    });
  }

  showJobDetails(job: IJobPost) {
    this.selectedJob = job;
  }

  hideJobDetails() {
    this.isClosing = true;
    setTimeout(() => {
      this.selectedJob = null;
      this.isClosing = false;
    }, 300); // Match this with the animation duration
  }

  toggleDetails(index: number): void {
    this.showMore[index] = !this.showMore[index];
  }
  handleShowMoreClick(event: Event, index: number): void {
    event.stopPropagation(); // Stop the event from bubbling up
    this.toggleDetails(index); // Toggle the showMore state
  }

  scrollLeft(event: Event, container: HTMLElement) {
    event.stopPropagation();
    if (container) {
      container.scrollBy({
        left: -100, // Adjust scroll distance as needed
        behavior: 'smooth',
      });
    }
  }

  // Method to handle scrolling right
  scrollRight(event: Event, container: HTMLElement) {
    event.stopPropagation();
    if (container) {
      container.scrollBy({
        left: 100, // Adjust scroll distance as needed
        behavior: 'smooth',
      });
    }
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
