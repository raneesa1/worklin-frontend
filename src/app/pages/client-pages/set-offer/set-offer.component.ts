import { Component, OnInit } from '@angular/core';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { jobManagementService } from '../job-management/service/job-management.service';
import { roleService } from '../../../shared/service/role.service';
import { Observable, takeUntil } from 'rxjs';
import { IJobPost } from '../job-management/interfaces/jobPost';
import { FreelancerEntity } from '../../../shared/types/FreelancerEntity';
import { Router } from '@angular/router';
import { DisplayResultModalComponent } from '../../../components/display-result-modal/display-result-modal.component';
import { CloudinaryService } from '../../../shared/service/cloudinary.service';
import { environment } from '../../../../environment/environment';

interface Milestone {
  id: number;
  description: string;
  dueDate: Date;
  amount: number;
}
@Component({
  selector: 'app-set-offer',
  standalone: true,
  imports: [
    NavbarAfterLoginComponent,
    FormsModule,
    CommonModule,
    DatePickerComponent,
    ReactiveFormsModule,
    DisplayResultModalComponent,
  ],
  templateUrl: './set-offer.component.html',
  styleUrl: './set-offer.component.scss',
})
export class SetOfferComponent implements OnInit {
  paymentType: 'fixed' | 'hourly' = 'fixed';
  paymentOption: 'oneTime' | 'mileStone' = 'oneTime';
  fixedPrice: number | undefined = 0;
  hourlyRate: number = 0;
  totalHours: number = 0;
  jobPosts: IJobPost[] = [];
  contractTitle: string | undefined = ''; // For storing contract title
  selectedJobPostId: string = ''; // Initialize with empty string for default option
  selectedJobPost: IJobPost | null = null; // Store the selected job post
  dueDate: Date = new Date();
  description: string = '';
  mileStone: Milestone[] = [];
  hiringTeam: string = '';
  freelancer: FreelancerEntity | null = null;
  displayResultModal: boolean = false;
  submitFiles: string[] = [];
  uploadedFiles: File[] = []; // For storing uploaded files
  validationErrors: string[] = [];
  // Modal control variables
  modalStatus: 'success' | 'fail' | 'info' = 'info'; // Default value
  modalMessage: string = '';

  constructor(
    private jobService: jobManagementService,
    private roleService: roleService,
    private jobOfferService: jobManagementService,
    private router: Router, // Inject the new service,
    private fileUploadService: CloudinaryService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.freelancer = navigation.extras.state[
        'freelancer'
      ] as FreelancerEntity;
    }
  }

  ngOnInit(): void {
    this.fetchJobPosts();
    console.log(this.freelancer);
    console.log(this.jobPosts, 'consoling the job post');
  }

  setPaymentType(type: 'fixed' | 'hourly'): void {
    this.paymentType = type;
    this.paymentOption = 'oneTime';
  }

  fetchJobPosts(): void {
    const clientId = this.roleService.getUserId();
    this.jobService.getJobPostsByUserId(clientId).subscribe({
      next: (response: any) => {
        this.jobPosts = response.jobPosts;
        console.log(this.jobPosts, 'Fetched job posts');
      },
      error: (err) => {
        console.error('Error fetching job posts', err);
      },
    });
  }

  setPaymentOption(option: 'oneTime' | 'mileStone'): void {
    this.paymentOption = option;
  }

  onJobPostSelected(event: Event): void {
    const selectedJobId = (event.target as HTMLSelectElement).value;
    this.selectedJobPostId = selectedJobId;
    this.selectedJobPost =
      this.jobPosts.find((job) => job._id === selectedJobId) || null;

    if (this.selectedJobPost) {
      this.contractTitle = this.selectedJobPost.title;
      this.fixedPrice = this.selectedJobPost.priceFrom;
    }
    this.mileStone = [];
  }
  addMilestone(): void {
    this.mileStone.push({
      id: Date.now(),
      description: '',
      dueDate: new Date(),
      amount: 0,
    });
    this.updateTotalAmount();
  }

  deleteMilestone(id: number): void {
    this.mileStone = this.mileStone.filter((milestone) => milestone.id !== id);
    this.updateTotalAmount();
  }

  get totalAmount(): number {
    return this.hourlyRate * this.totalHours;
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 25 * 1024 * 1024) {
      // 25MB file size limit
      this.uploadedFiles.push(file);
      this.uploadFileToCloudinary(file).subscribe({
        next: (response) => {
          const fileUrl = response.secure_url; // Adjust based on Cloudinary response structure
          this.submitFiles.push(fileUrl); // Store file info with URL
        },
        error: (err) => {
          alert('Error uploading file to Cloudinary: ' + err.message);
        },
      });
    } else {
      alert('File size exceeds the 25 MB limit.');
    }
  }
  updateTotalAmount(): void {
    if (this.paymentType === 'fixed' && this.paymentOption === 'mileStone') {
      this.fixedPrice = this.mileStone.reduce(
        (total, milestone) => total + milestone.amount,
        0
      );
    }
  }
  uploadFileToCloudinary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinaryUploadPreset); // Replace with your Cloudinary upload preset

    return this.fileUploadService.uploadToCloudinary(formData); // Make sure your service has this method
  }
  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
  }

  validateForm(): boolean {
    this.validationErrors = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!this.contractTitle || this.contractTitle.trim() === '') {
      this.validationErrors.push('Contract title is required.');
    }

    if (!this.selectedJobPostId) {
      this.validationErrors.push('Please select a job post.');
    }

    if (this.paymentType === 'fixed') {
      if (!this.fixedPrice || this.fixedPrice <= 0) {
        this.validationErrors.push('Fixed price must be greater than 0.');
      }
    } else if (this.paymentType === 'hourly') {
      if (!this.hourlyRate || this.hourlyRate <= 0) {
        this.validationErrors.push('Hourly rate must be greater than 0.');
      }
      if (!this.totalHours || this.totalHours <= 0) {
        this.validationErrors.push('Total hours must be greater than 0.');
      }
    }

    if (this.paymentOption === 'oneTime') {
      if (!this.dueDate || this.dueDate <= today) {
        this.validationErrors.push('Due date must be after today.');
      }
    } else if (this.paymentOption === 'mileStone') {
    }

    if (!this.description || this.description.trim() === '') {
      this.validationErrors.push('Description is required.');
    }

    if (!this.hiringTeam || this.hiringTeam.trim() === '') {
      this.validationErrors.push('Hiring team information is required.');
    }

    return this.validationErrors.length === 0;
  }

  onSubmit(): void {
    // if (this.validateForm()) {
    const clientId = this.roleService.getUserId();
    const freelancerId = this.freelancer?._id;

    const jobOfferData = {
      clientId,
      freelancerId,
      hiringTeam: this.hiringTeam,
      relatedJobId: this.selectedJobPostId,
      title: this.contractTitle,
      paymentType: this.paymentType,
      paymentOption: this.paymentOption,
      totalAmount:
        this.paymentType === 'fixed' ? this.fixedPrice : this.totalAmount,
      hourlyRate: this.paymentType === 'hourly' ? this.hourlyRate : undefined,
      numberOfHours:
        this.paymentType === 'hourly' ? this.totalHours : undefined,
      mileStone:
        this.paymentOption === 'mileStone'
          ? this.mileStone.map((m) => ({
              description: m.description,
              dueDate: new Date(m.dueDate),
              amount: m.amount,
              isPaid: false,
            }))
          : undefined,
      description: this.description,
      files: this.submitFiles.map((file) => file),
      dueDate:
        this.paymentOption === 'oneTime' ? new Date(this.dueDate) : undefined,
    };

    this.jobService.createJobOffer(jobOfferData).subscribe({
      next: (response) => {
        this.modalStatus = 'success';
        this.modalMessage = 'Job offer created successfully!';
        this.displayResultModal = true;
        setTimeout(() => {
          this.closeModal();
          this.clearForm();
        }, 2000);
      },
      error: (error) => {
        this.modalStatus = 'fail';
        this.modalMessage = 'Error creating job offer. Please try again.';
        this.displayResultModal = true;
        console.error('Error creating job offer', error);
      },
    });
    // }
  }

  clearForm(): void {
    // Reset all form fields
    this.uploadedFiles = [];
    this.contractTitle = '';
    this.fixedPrice = 0;
    this.hourlyRate = 0;
    this.totalHours = 0;
    this.description = '';
    this.hiringTeam = '';
    this.mileStone = [];
    this.selectedJobPostId = '';
    this.dueDate = new Date();
    this.paymentType = 'fixed';
    this.paymentOption = 'oneTime';
  }
  closeModal(): void {
    this.displayResultModal = false;
    this.modalStatus = 'info';
    this.modalMessage = '';
  }
}
