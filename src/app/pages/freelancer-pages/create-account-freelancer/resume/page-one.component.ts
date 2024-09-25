import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ResumeUploadModalComponent } from '../resume-upload-modal/resume-upload-modal.component';
import { CommonModule } from '@angular/common';


interface ResumeInfo {
  fileName: string;
  fileFormat: string;
  uploadDate: Date;
}

@Component({
  selector: 'app-page-one',
  standalone: true,
  imports: [RouterModule, ResumeUploadModalComponent, CommonModule],
  templateUrl: './page-one.component.html',
  styleUrl: './page-one.component.scss',
})
export class PageOneComponent {
  isModalOpen = false;
  isResumeUploaded = false;
  showError = false;
  resumeInfo: ResumeInfo | null = null;

  constructor(private router: Router) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  onResumeUploaded(info: ResumeInfo) {
    this.isResumeUploaded = true;
    this.resumeInfo = info;
    this.showError = false;
  }

  nextPage() {
    if (this.isResumeUploaded) {
      this.router.navigate(['/freelancer/create-account-category']);
    } else {
      this.showError = true;
    }
  }

  removeResume() {
    this.isResumeUploaded = false;
    this.resumeInfo = null;
  }
}
