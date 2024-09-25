import { Component, Input, OnInit } from '@angular/core';
import { IJobPost } from '../interfaces/jobPost';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';

@Component({
  selector: 'app-review-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-applications.component.html',
  styleUrl: './review-applications.component.scss',
})
export class ReviewApplicationsComponent implements OnInit {
  @Input() jobData!: IJobPost | null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private profileService: ProfileManagementService
  ) {}

  ngOnInit(): void {
    console.log(this.jobData, 'consoling the job data in ngOnInit');
  }

  triggerDownload(publicId: string): void {
    console.log('Download triggered for public ID:', publicId);

    // Construct the Cloudinary URL using the correct format
    const downloadUrl = `https://res.cloudinary.com/dgyd6acjg/raw/upload/${publicId}`;

    console.log('Download URL:', downloadUrl);

    this.http.get(downloadUrl, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        // Create a blob URL for the file
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume_${publicId.split('/').pop()}`; // Use the last part of the public ID as the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Download failed:', error);
        // Inform the user about the error
        alert('Failed to download the file. Please try again later.');
      },
    });
  }

  viewProfile(freelancerId: string): void {
    console.log('Navigating to applicant profile with ID:', freelancerId);
    this.router.navigate(['/client/applicant', freelancerId]);
  }
}
