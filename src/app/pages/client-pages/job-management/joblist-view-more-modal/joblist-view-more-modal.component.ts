import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { IJobPost } from '../interfaces/jobPost';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { jobManagementService } from '../service/job-management.service';

@Component({
  selector: 'app-joblist-view-more-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './joblist-view-more-modal.component.html',
  styleUrls: ['./joblist-view-more-modal.component.scss'],
})
export class JoblistViewMoreModalComponent {
  activeDropdownIndex: number | null = null;

  @Input() jobPost?: IJobPost;
  @Input() index!: number;

  constructor(
    private jobPostService: jobManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  toggleDropdown(index: number) {
    if (this.activeDropdownIndex === index) {
      this.activeDropdownIndex = null;
    } else {
      this.activeDropdownIndex = index;
    }
  }
  removeJobPost(jobId: string): void {
    if (confirm('Are you sure you want to remove this job posting?')) {
      this.jobPostService.deleteJobPost(jobId).subscribe({
        next: (response) => {
          console.log('deleted');
        },
        error: (err) => {
          console.error('Error deleting job post:', err);
          alert('Failed to delete the job post.');
        },
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.activeDropdownIndex = null;
    }
  }
}
