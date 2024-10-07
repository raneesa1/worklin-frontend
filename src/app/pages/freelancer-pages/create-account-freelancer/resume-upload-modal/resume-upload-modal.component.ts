import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { roleService } from '../../../../shared/service/role.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environment/environment';

interface ResumeInfo {
  fileName: string;
  fileFormat: string;
  uploadDate: Date;
}

@Component({
  selector: 'app-resume-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-upload-modal.component.html',
  styleUrls: ['./resume-upload-modal.component.scss'],
})
export class ResumeUploadModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() close = new EventEmitter<void>();
  @Output() resumeUpload = new EventEmitter<ResumeInfo>();

  selectedFile: File | null = null;
  isLoading = false;
  loadingProgress = 0;
  resumeUploaded = false;
  uploadedFileName = '';
  isError = false;
  uploadedFileFormat = '';
  errorMessage = '';

  constructor(private http: HttpClient, private roleService: roleService) {}

  ngOnInit() {}

  closeModal() {
    this.close.emit();
    this.resetState();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      this.showError(
        'File size exceeds 10MB limit. Please choose a smaller file.'
      );
      return;
    }
    this.selectedFile = file;
    this.uploadedFileName = file.name;
    this.uploadedFileFormat = file.name.split('.').pop()?.toUpperCase() || '';
    this.uploadToCloudinary();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  uploadToCloudinary() {
    if (!this.selectedFile) {
      this.showError('No file selected. Please choose a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', environment.cloudinaryUploadPreset); // Replace with your upload preset

    this.isLoading = true;
    this.http
      .post(
        `https://api.cloudinary.com/v1_1/${environment.cloudinaryCloudName}/raw/upload`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .subscribe({
        next: (event: any) => {
          if (event.type === 1 && event.loaded && event.total) {
            this.loadingProgress = Math.round(
              (event.loaded / event.total) * 100
            );
          }
          if (event.body) {
            this.saveResumeUrl(
              event.body.secure_url,
              event.body.original_filename,
              event.body.public_id
            );
          }
        },
        error: (err) => {
          console.error('Error uploading to Cloudinary:', err);
          this.isLoading = false;
          this.showError('Upload failed. Please try again.');
        },
      });
  }

  saveResumeUrl(url: string, fileName: string, publicId: string) {
    const freelancerId = this.roleService.getUserId();
    if (!freelancerId) {
      this.showError('Failed to retrieve user ID. Please try again.');
      this.isLoading = false;
      return;
    }

    this.http
      .post(`${environment.backendUrl}/user/uploadResume`, {
        url,
        freelancerId,
        publicId,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Resume URL saved successfully', response);
          this.resumeUploaded = true;
          this.uploadedFileName = fileName;
          this.isLoading = false;
          this.disableFileInput();

          const resumeInfo: ResumeInfo = {
            fileName: this.uploadedFileName,
            fileFormat: this.uploadedFileFormat,
            uploadDate: new Date(),
          };
          this.resumeUpload.emit(resumeInfo);
        },
        error: (error) => {
          console.error('Error saving resume URL', error);
          this.showError('Failed to save resume. Please try again.');
          this.isLoading = false;
        },
      });
  }

  removeFile() {
    this.selectedFile = null;
    this.resumeUploaded = false;
    this.uploadedFileName = '';
    this.uploadedFileFormat = '';
    this.enableFileInput();
  }

  showError(message: string) {
    this.isError = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.isError = false;
      this.errorMessage = '';
    }, 5000);
  }

  resetState() {
    this.selectedFile = null;
    this.isLoading = false;
    this.loadingProgress = 0;
    this.resumeUploaded = false;
    this.uploadedFileName = '';
    this.isError = false;
    this.uploadedFileFormat = '';
    this.errorMessage = '';
    this.enableFileInput();
  }

  disableFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.disabled = true;
    }
  }

  enableFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.disabled = false;
    }
  }
}
