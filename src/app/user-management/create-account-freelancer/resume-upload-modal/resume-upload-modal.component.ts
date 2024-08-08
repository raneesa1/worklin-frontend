import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileManagementService } from '../../service/profile-management.service';

@Component({
  selector: 'app-resume-upload-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-upload-modal.component.html',
  styleUrls: ['./resume-upload-modal.component.scss'],
})
export class ResumeUploadModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;
  isModalOpen = true;
  isLoading = false;
  loadingProgress = 0;
  resumeUploaded = false;
  uploadedFileName = '';
  isError = false;
  errorMessage = '';
  @Output() close = new EventEmitter<void>();

  constructor(private profileManagementService: ProfileManagementService) {}

  closeModal() {
    this.close.emit(); // Emit close event
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (this.isValidFileType(this.selectedFile)) {
        this.uploadedFileName = input.files[0].name;
        console.log('Selected file:', this.selectedFile);
        this.onUpload();
      } else {
        this.isError = true;
        console.log('Invalid file type');
        this.errorMessage =
          'Invalid file type. Please upload a PDF, Word doc, or rich text file.';
      }
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      if (this.isValidFileType(this.selectedFile)) {
        this.onUpload();
        console.log('Dropped file:', this.selectedFile);
        event.dataTransfer.clearData();
      } else {
        console.log('Invalid file type');
        this.isError = true;
        this.errorMessage =
          'Invalid file type. Please upload a PDF, Word doc, or rich text file.';
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onUpload() {
    if (this.selectedFile) {
      this.isLoading = true;

      this.loadingProgress = 0;

      // Simulate loading process
      const interval = setInterval(() => {
        this.loadingProgress += 10;
        if (this.loadingProgress >= 100) {
          clearInterval(interval);
          this.resumeUploaded = true;
          this.isLoading = false;
        }
      }, 200);
    }
  }

  removeFile() {
    this.resumeUploaded = false;
    this.uploadedFileName = '';
  }

  triggerFileInput() {
    const fileInput = document.getElementById('resume') as HTMLInputElement;
    fileInput.click();
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
    ];
    return allowedTypes.includes(file.type);
  }

  submit() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('resume', this.selectedFile); // Use the field name expected by your backend

      // Log FormData entries for debugging
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      console.log(formData, 'consoling the form data');
      this.profileManagementService.uploadResume(formData).subscribe({
        next: (response) => {
          console.log('Upload successful:', response);
          this.resumeUploaded = true;
          this.closeModal(); // Close modal on successful upload
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.isError = true;
          this.errorMessage = 'Failed to upload resume. Please try again.';
        },
      });
    } else {
      console.error('No file selected');
      this.isError = true;
      this.errorMessage = 'No file selected. Please choose a file to upload.';
    }
  }
}
