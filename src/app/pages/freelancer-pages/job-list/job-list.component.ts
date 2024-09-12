import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDetailPageComponent } from '../job-detail-page/job-detail-page.component';
import { roleService } from '../../../shared/service/role.service';
import {
  IJobPost,
  jobPostStatus,
} from '../../client-pages/job-management/interfaces/jobPost';
import { BrowseService } from '../../../shared/service/browse.service';
import {
  ISavedJobs,
  savedJobStatus,
} from '../../../shared/types/interfaces/saveJob';
import { Subscription } from 'rxjs';
import { SharedSearchService } from '../../../shared/service/sharedSearch.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, JobDetailPageComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss',
})
export class JobListComponent implements OnInit, OnDestroy {
  @Output() jobAppliedEvent = new EventEmitter<void>();

  jobPosts: IJobPost[] = [];
  filteredJobPosts: IJobPost[] = [];
  showMore: boolean[] = [];
  savedJobs: boolean[] = [];
  selectedJob: IJobPost | null = null;
  isClosing: boolean = false;
  hasAppliedToSelectedJob: boolean = false;
  searchQuery: string = '';
  searchType: string = '';
  private searchSubscription: Subscription = new Subscription();
  private typeSubscription: Subscription = new Subscription();

  currentUserId: string;
  savedJobsSet: Set<string | undefined> = new Set();

  selectedFilter: string = '';

  constructor(
    private sharedSearchService: SharedSearchService,
    private browseService: BrowseService,
    private roleService: roleService
  ) {
    this.currentUserId = this.roleService.getUserId();
  }

  ngOnInit(): void {
    this.loadSavedJobs();
    this.subscribeToSearchChanges();
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.typeSubscription.unsubscribe();
  }

  subscribeToSearchChanges(): void {
    this.searchSubscription = this.sharedSearchService.searchQuery$.subscribe(
      (query) => {
        this.searchQuery = query;
        this.applySearchAndFilter();
      }
    );
    this.typeSubscription = this.sharedSearchService.searchType$.subscribe(
      (type) => {
        this.searchType = type;
        this.applySearchAndFilter();
      }
    );
  }
  loadSavedJobs(): void {
    const freelancerId = this.roleService.getUserId();
    this.browseService.getSavedJobs(freelancerId).subscribe({
      next: (savedJobs: ISavedJobs[]) => {
        this.savedJobsSet = new Set(savedJobs.map((job) => job._id));
        this.loadJobPosts();
      },
      error: (error) => {
        console.error('Error loading saved jobs:', error);
        this.loadJobPosts();
      },
    });
  }

  loadJobPosts(): void {
    this.browseService.getJobPosts().subscribe((response: any) => {
      this.jobPosts = response.jobPost.map((job: IJobPost) => ({
        ...job,
        isFavorite: this.savedJobsSet.has(job._id || ''),
      }));
      this.showMore = new Array(this.jobPosts.length).fill(false);
      this.applySearchAndFilter();
    });
  }

  onFilterChange(): void {
    this.applySearchAndFilter();
  }

  applySearchAndFilter(): void {
    this.filteredJobPosts = this.jobPosts.filter((job) => {
      const matchesSearch =
        !this.searchQuery ||
        job.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesType = !this.searchType || this.searchType === 'jobs';

      const matchesFilter =
        !this.selectedFilter ||
        (this.selectedFilter === 'saved' && job.isFavorite) ||
        (this.selectedFilter === 'applied' && this.checkIfApplied(job));

      return matchesSearch && matchesType && matchesFilter;
    });
  }

  checkIfApplied(job: IJobPost): boolean {
    return job.appliedFreelancers?.includes(this.currentUserId) || false;
  }

  updateJobFavoriteStatus(): void {
    this.jobPosts = this.jobPosts.map((job) => ({
      ...job,
      isFavorite: this.savedJobsSet.has(job._id || ''),
    }));
    this.applySearchAndFilter();
  }

  showJobDetails(job: IJobPost) {
    this.selectedJob = job;
    this.hasAppliedToSelectedJob = this.checkIfApplied(job);
  }

  closeJobDetails() {
    this.hideJobDetails();
  }

  hideJobDetails() {
    this.isClosing = true;
    setTimeout(() => {
      this.selectedJob = null;
      this.isClosing = false;
    }, 300);
  }

  toggleDetails(index: number): void {
    this.showMore[index] = !this.showMore[index];
  }

  handleShowMoreClick(event: Event, index: number): void {
    event.stopPropagation();
    this.toggleDetails(index);
  }

  scrollLeft(event: Event, container: HTMLElement) {
    event.stopPropagation();
    if (container) {
      container.scrollBy({ left: -100, behavior: 'smooth' });
    }
  }

  scrollRight(event: Event, container: HTMLElement) {
    event.stopPropagation();
    if (container) {
      container.scrollBy({ left: 100, behavior: 'smooth' });
    }
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
        this.updateJobFavoriteStatus();
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
        return savedJobStatus.active;
    }
  }

  selectJob(job: IJobPost) {
    this.selectedJob = job;
  }

  onJobApplied() {
    if (this.selectedJob) {
      this.selectedJob.appliedFreelancers =
        this.selectedJob.appliedFreelancers || [];
      this.selectedJob.appliedFreelancers.push(this.currentUserId);
      this.hasAppliedToSelectedJob = true;
    }
    this.updateJobInList(this.selectedJob);
    this.jobAppliedEvent.emit();
  }

  updateJobInList(updatedJob: IJobPost | null) {
    if (updatedJob) {
      const index = this.jobPosts.findIndex(
        (job) => job._id === updatedJob._id
      );
      if (index !== -1) {
        this.jobPosts[index] = { ...this.jobPosts[index], ...updatedJob };
        this.applySearchAndFilter();
      }
    }
  }
}
