import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileManagementService } from '../../service/profile-management.service';
import { ResumeUploadModalComponent } from '../resume-upload-modal/resume-upload-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-one',
  standalone: true,
  imports: [RouterModule, ResumeUploadModalComponent, CommonModule],
  templateUrl: './page-one.component.html',
  styleUrl: './page-one.component.scss',
})
export class PageOneComponent {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
