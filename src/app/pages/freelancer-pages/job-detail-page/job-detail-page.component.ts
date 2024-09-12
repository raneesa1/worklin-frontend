import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { roleService } from '../../../shared/service/role.service';
import { IJobPost } from '../../client-pages/job-management/interfaces/jobPost';
import { BrowseService } from '../../../shared/service/browse.service';

@Component({
  selector: 'app-job-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail-page.component.html',
  styleUrl: './job-detail-page.component.scss',
})
export class JobDetailPageComponent {
  @Input() job!: IJobPost | null;
  @Input() hasApplied: boolean = false;
  isApplying: boolean = false;
  showSuccessModal: boolean = false;
  @Output() jobApplied = new EventEmitter<void>();
  @Output() closeDetailPage = new EventEmitter<void>();

  constructor(
    private roleService: roleService,
    private browseService: BrowseService
  ) {}

  applyJob(jobId?: string): void {
    console.log(this.hasApplied, 'consoling from apply job');
    if (this.hasApplied) {
      console.log('Already applied to this job');
      return;
    }

    const userId = this.roleService.getUserId();
    if (!userId) {
      return console.log('userId is required');
    }
    if (!jobId) {
      return console.log('jobId is required');
    }

    this.isApplying = true;

    this.browseService.applyForJob(userId, jobId).subscribe({
      next: (response) => {
        console.log('Application successful', response);
        this.isApplying = false;
        this.hasApplied = true;
        this.jobApplied.emit();
        this.showSuccessModal = true;
        this.closeDetailPage.emit();
      },
      error: (error) => {
        console.error('Error applying for job', error);
        this.isApplying = false;
      },
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }
}
