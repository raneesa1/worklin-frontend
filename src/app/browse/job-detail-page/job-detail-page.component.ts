import { Component, Input } from '@angular/core';
import { IJobPost } from '../../job-management/interfaces/jobPost';
import { CommonModule } from '@angular/common';
import { roleService } from '../../../role.service';
import { BrowseService } from '../service/browse.service';

@Component({
  selector: 'app-job-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail-page.component.html',
  styleUrl: './job-detail-page.component.scss',
})
export class JobDetailPageComponent {
  @Input() job!: IJobPost | null;
  selectedJob: IJobPost | null = null;
  constructor(
    private roleService: roleService,
    private browseService: BrowseService
  ) {}

  applyJob(jobId?: string): void {
    const userId = this.roleService.getUserId();
    if (!userId) {
      return console.log('userId is required');
    }
    if (!jobId) {
      return console.log('jobId is required');
    }
    console.log(jobId, userId);
    if (jobId) {
      this.browseService.applyForJob(userId, jobId).subscribe({
        next: (response) => {
          console.log('Application successful', response);
        },
        error: (error) => {
          console.error('Error applying for job', error);
        },
      });
    } else {
      console.log('jobId is required');
    }
  }
}
