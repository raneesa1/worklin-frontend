import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileManagementService } from '../../service/profile-management.service';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { roleService } from '../../../../role.service';
import { Observable } from 'rxjs';
import { PhotoUploadModalComponent } from '../photo-upload-modal/photo-upload-modal.component';
import { FormsModule } from '@angular/forms';
declare var cloudinary: any;

@Component({
  selector: 'app-resume-upload-modal',
  standalone: true,
  imports: [CommonModule, PhotoUploadModalComponent, FormsModule],
  templateUrl: './resume-upload-modal.component.html',
  styleUrls: ['./resume-upload-modal.component.scss'],
})
export class ResumeUploadModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;
  isModalOpen = true;
  isLoading = false;
  loadingProgress = 0;
  resumeUploaded = false;
  uploadedFileName = '';
  isError = false;
  errorMessage = '';
  uploadedImageUrl: string = '';
  @Output() close = new EventEmitter<void>();
  cloudinaryWidget: any;

  constructor(
    private profileManagementService: ProfileManagementService,
    private http: HttpClient,
    private roleService: roleService // Inject roleService
  ) {}
  ngOnInit() {
    this.initCloudinaryWidget();
  }
  initCloudinaryWidget() {
    this.cloudinaryWidget = cloudinary.createUploadWidget(
      {
        cloudName: 'dgyd6acjg', // Replace with your Cloudinary cloud name
        uploadPreset: 'worklin', // Replace with your upload preset
        sources: ['local', 'url'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 10000000, // 10MB
        clientAllowedFormats: ['pdf', 'doc', 'docx'],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log(
            'Done! Here is the file info: ==========>>>>>>>>>>',
            result.info
          );
          console.log(result.info.secure_url, 'consoling the url');
          this.saveResumeUrl(
            result.info.secure_url,
            result.info.original_filename,
            result.info.public_id
          );
        }
      }
    );
  }
  openCloudinaryWidget() {
    this.cloudinaryWidget.open();
  }
  saveResumeUrl(url: string, fileName: string, publicId: string) {
    const freelancerId = this.roleService.getUserId();
    if (!freelancerId) {
      this.showError('Failed to retrieve user ID. Please try again.');
      return;
    }

    this.http
      .post('http://localhost:8000/user/uploadResume', {
        url,
        freelancerId,
        publicId,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Resume URL saved successfully', response);
          this.resumeUploaded = true;
          this.uploadedFileName = fileName;
          this.closeModal();
        },
        error: (error) => {
          console.error('Error saving resume URL', error);
          this.showError('Failed to save resume. Please try again.');
        },
      });
  }
  closeModal() {
    this.close.emit();
    this.resetState();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (this.selectedFile && this.selectedFile.size > 10 * 1024 * 1024) {
        this.showError(
          'File size exceeds 10MB limit. Please choose a smaller file.'
        );
        console.log(
          'File size exceeds 10MB limit. Please choose a smaller file.'
        );
        return;
      }
      this.uploadedFileName = this.selectedFile.name;
      // this.submit();
      this.submitToCloudinary();
    }
  }

  submitToCloudinary() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', 'worklin'); // Replace with your upload preset

      this.isLoading = true;
      this.http
        .post(`https://api.cloudinary.com/v1_1/dgyd6acjg/raw/upload`, formData)
        .subscribe({
          next: (response: any) => {
            console.log(response, 'consoling the response  ========>>>>>>>>>>');
            const resumeUrl = response.secure_url;
            const publicId = response.public_id;
            this.uploadedFileName = response.original_filename;

            // Pass resumeUrl and publicId to saveResumeUrl method
            this.saveResumeUrl(
              resumeUrl,
              this.uploadedFileName,
              publicId
            );
          },
          error: (err) => {
            console.error('Error uploading to Cloudinary:', err);
            this.isLoading = false;
            this.showError('Upload failed. Please try again.');
          },
        });
    } else {
      this.showError('No file selected. Please choose a file to upload.');
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.uploadedFileName = this.selectedFile.name;
      this.submit();
      event.dataTransfer.clearData();
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
  submit() {
    if (this.selectedFile) {
      const freelancerId = this.roleService.getUserId();
      if (!freelancerId) {
        this.showError('Failed to retrieve user ID. Please try again.');
        this.isLoading = false;
        return;
      }

      console.log('File size:', this.selectedFile.size);
      console.log('File type:', this.selectedFile.type);

      // const formData = new FormData();
      // formData.append('resume', this.selectedFile, this.selectedFile.name);
      // formData.append('id', freelancerId);

      const formData = new FormData();
      formData.append('resume', this.selectedFile, this.selectedFile.name);
      // formData.append('id', freelancerId);

      this.http
        .post('http://localhost:8000/user/uploadResume', formData, {
          reportProgress: true,
          observe: 'events',
        })
        .subscribe({
          next: (event: HttpEvent<any>) => this.handleUploadEvent(event),
          error: (err) => {
            console.error('Error from submit function:', err);
            this.isLoading = false;
            this.showError('Upload failed. Please try again.');
          },
        });
    } else {
      this.showError('No file selected. Please choose a file to upload.');
    }
  }
  handleUploadEvent(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        if (event.total) {
          this.loadingProgress = Math.round((event.loaded / event.total) * 100);
        }
        break;
      case HttpEventType.Response:
        if (event.body && event.body.success) {
          this.resumeUploaded = true;
          this.isLoading = false;
          this.closeModal();
        } else {
          this.showError(event.body?.message || 'Failed to upload resume.');
          this.isLoading = false;
        }
        break;
    }
  }

  removeFile() {
    this.resumeUploaded = false;
    this.uploadedFileName = '';
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
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
    this.errorMessage = '';
  }

  onImageUploaded(url: string) {
    this.uploadedImageUrl = url;
    console.log(this.uploadedImageUrl);
  }
}
