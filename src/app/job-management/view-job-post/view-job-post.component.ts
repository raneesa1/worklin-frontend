import { Component, Input } from '@angular/core';
import { BrowseService } from '../../browse/service/browse.service';
import { roleService } from '../../../role.service';
import { IJobPost } from '../interfaces/jobPost';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-job-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-job-post.component.html',
  styleUrl: './view-job-post.component.scss',
})
export class ViewJobPostComponent {
  @Input() job!: IJobPost | null;
  constructor(
    private roleService: roleService,
    private browseService: BrowseService
  ) {}

  ngOnInit(): void {
    console.log(
      this.job,
      'consoling the job data in ngOnInit from view job post'
    );
  }
}
