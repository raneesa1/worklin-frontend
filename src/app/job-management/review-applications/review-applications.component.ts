import { Component, Input, OnInit } from '@angular/core';
import { IJobPost } from '../interfaces/jobPost';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-review-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-applications.component.html',
  styleUrl: './review-applications.component.scss',
})
export class ReviewApplicationsComponent implements OnInit {
  @Input() jobData!: IJobPost | null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log(this.jobData, 'consoling the job data in ngOnInit');
  }

  triggerDownload(publicId: string): void {
    console.log('Download triggered');
    // Generate the Cloudinary download URL with the attachment flag
    const downloadUrl = `https://res.cloudinary.com/dgyd6acjg/image/upload/fl_attachment/${publicId}.pdf`;

    console.log('Download URL:', downloadUrl);

    // Create a temporary anchor element and trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `resume_${publicId}.pdf`; // Customize the file name as needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
