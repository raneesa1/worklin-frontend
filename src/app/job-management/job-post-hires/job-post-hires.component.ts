import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IJobPost } from '../interfaces/jobPost';

@Component({
  selector: 'app-job-post-hires',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-post-hires.component.html',
  styleUrl: './job-post-hires.component.scss',
})
export class JobPostHiresComponent {
  @Input() jobData!: IJobPost | null;
}
