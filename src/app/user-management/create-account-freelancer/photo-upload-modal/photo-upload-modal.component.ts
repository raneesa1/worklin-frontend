import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-photo-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent],
  templateUrl: './photo-upload-modal.component.html',
  styleUrl: './photo-upload-modal.component.scss',
})
export class PhotoUploadModalComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperMaxWidth: number = 256;
  zoomLevel: number = 1;

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  zoomIn() {
    this.zoomLevel += 0.1;
    this.updateZoom();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 1);
    this.updateZoom();
  }

  updateZoom() {
    this.cropperMaxWidth = 256 * this.zoomLevel;
  }

  attachPhoto() {
    // Logic to attach photo
    console.log(this.croppedImage);
  }

  closeModal() {
    // Logic to close modal
  }
}
