import { Component, OnInit } from '@angular/core';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { jobManagementService } from '../job-management/service/job-management.service';
import { roleService } from '../../../shared/service/role.service';
import { takeUntil } from 'rxjs';
import { IJobPost } from '../job-management/interfaces/jobPost';
import { FreelancerEntity } from '../../../shared/types/FreelancerEntity';
import { Router } from '@angular/router';

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

  constructor(
    private jobService: jobManagementService,
    private roleService: roleService,
    private jobOfferService: jobManagementService,
    private router: Router // Inject the new service
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

  uploadedFiles: File[] = []; // For storing uploaded files

  setPaymentType(type: 'fixed' | 'hourly'): void {
    this.paymentType = type;
    this.paymentOption = 'oneTime';
  }

  fetchJobPosts(): void {
    const clientId = this.roleService.getUserId(); // Fetch the user ID
    this.jobService.getJobPostsByUserId(clientId).subscribe({
      next: (response: any) => {
        this.jobPosts = response.jobPosts; // Extract jobPosts from the response
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
    this.selectedJobPostId = selectedJobId; // Update selected job post ID
    this.selectedJobPost =
      this.jobPosts.find((job) => job._id === selectedJobId) || null;

    if (this.selectedJobPost) {
      this.contractTitle = this.selectedJobPost.title;
      this.fixedPrice = this.selectedJobPost.priceFrom;
    }
  }
  addMilestone(): void {
    this.mileStone.push({
      id: Date.now(),
      description: '',
      dueDate: new Date(),
      amount: 0,
    });
  }

  deleteMilestone(id: number): void {
    this.mileStone = this.mileStone.filter((milestone) => milestone.id !== id);
  }

  get totalAmount(): number {
    return this.hourlyRate * this.totalHours;
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 25 * 1024 * 1024) {
      // 25MB file size limit
      this.uploadedFiles.push(file);
    } else {
      alert('File size exceeds the 25 MB limit.');
    }
  }
  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
  }
  onSubmit(): void {
    const clientId = this.roleService.getUserId();
    const freelancerId = this.freelancer?._id; // You need to get this from somewhere, perhaps from the selected job post or user input

    const jobOfferData = {
      clientId,
      freelancerId,
      hiringTeam: this.hiringTeam,
      relatedJobId: this.selectedJobPostId,
      title: this.contractTitle,
      paymentType: this.paymentType,
      paymentOption: this.paymentOption,
      totalAmount:
        this.paymentType === 'fixed'
          ? this.fixedPrice
          : this.hourlyRate * this.totalHours,
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
      files: this.uploadedFiles.map((file) => file.name), // You might want to upload files separately and store URLs here
      dueDate:
        this.paymentOption === 'oneTime' ? new Date(this.dueDate) : undefined,
    };

    console.log(jobOfferData, 'consoling the job offer data');
    this.jobService.createJobOffer(jobOfferData).subscribe({
      next: (response) => {
        console.log('Job offer created successfully', response);
        // Handle success (e.g., show a success message, navigate to a different page)
      },
      error: (error) => {
        console.error('Error creating job offer', error);
        // Handle error (e.g., show an error message to the user)
      },
    });
  }
}
