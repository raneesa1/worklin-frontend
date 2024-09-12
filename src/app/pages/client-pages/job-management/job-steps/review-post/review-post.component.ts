import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IJobPost } from '../../interfaces/jobPost';
import { EditDurationModalComponent } from '../edit-duration-modal/edit-duration-modal.component';
import { EditSkillModalComponent } from '../edit-skill-modal/edit-skill-modal.component';
import { EditExperienceLevelModalComponent } from '../edit-experience-level-modal/edit-experience-level-modal.component';
import { EditBudgetModalComponent } from '../edit-budget-modal/edit-budget-modal.component';
import { Skill } from '../../interfaces/skill';
import { jobManagementService } from '../../service/job-management.service';
import { ConfirmJobPostModalComponent } from '../../../../../components/confirm-job-post-modal/confirm-job-post-modal.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-review-post',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    EditDurationModalComponent,
    EditSkillModalComponent,
    EditExperienceLevelModalComponent,
    EditBudgetModalComponent,
    ConfirmJobPostModalComponent,
  ],
  templateUrl: './review-post.component.html',
  styleUrl: './review-post.component.scss',
})
export class ReviewPostComponent {
  title = '';
  jobPost: IJobPost = {} as IJobPost;
  isTitleEditing = false;
  isErrorMessage = false;
  isDescriptionEditing = false;
  descriptionError = false;
  isDurationModalOpen = false;
  isSkillModalOpen = false;
  isExperienceModalOpen = false;
  isPriceModalOpen = false;
  isConfirmModalOpen = true;
  @ViewChild('titleInput') titleInputRef!: ElementRef;
  @ViewChild(EditDurationModalComponent)
  durationModal!: EditDurationModalComponent;
  @ViewChild(EditSkillModalComponent)
  skillModal!: EditSkillModalComponent;
  @ViewChild(EditExperienceLevelModalComponent)
  experienceModal!: EditExperienceLevelModalComponent;
  @ViewChild(EditBudgetModalComponent)
  budgetModal!: EditBudgetModalComponent;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadJobPost();
  }

  constructor(
    private jobService: jobManagementService,
    private router: Router
  ) {}

  loadJobPost() {
    const storedJobPost = localStorage.getItem('jobPost');
    console.log(
      storedJobPost,
      'consoling the stored job post from review post component'
    );
    if (storedJobPost) {
      this.jobPost = JSON.parse(storedJobPost);
      console.log(this.jobPost, 'consoling the job post');
    }
  }
  get skillsList(): string {
    // Check if jobPost.skills is defined and has items
    if (this.jobPost.skills && this.jobPost.skills.length > 0) {
      return this.jobPost.skills.map((skill) => skill.name).join(', ');
    }
    return 'No skills listed'; // Provide a default value
  }
  saveTitle() {
    const title = this.jobPost?.title?.trim();

    if (!title) {
      // Check if title is empty or contains only whitespace
      this.isErrorMessage = true;
      return;
    }

    if (title.length < 3 || title.length > 50) {
      // Check if title length is within the valid range
      this.isErrorMessage = true;
      return;
    }

    // If all checks pass, disable the error message and exit the editing state
    this.isErrorMessage = false;
    this.isTitleEditing = false;
    this.updateJobPostInLocalStorage();
  }
  updateJobPostInLocalStorage() {
    localStorage.setItem('jobPost', JSON.stringify(this.jobPost));
  }

  onTitleInput() {
    if (this.jobPost?.title?.trim().length !== 0) {
      this.isErrorMessage = false;
    }
  }
  editTitle() {
    setTimeout(() => {
      this.titleInputRef.nativeElement.focus();
    }, 0);
    this.isTitleEditing = true;
  }
  saveDescription() {
    const trimmedDescription = this.jobPost.description?.trim();

    if (!trimmedDescription) {
      this.descriptionError = true;
      return;
    }

    if (trimmedDescription.length < 3 || trimmedDescription.length > 200) {
      this.descriptionError = true;
      return;
    }

    this.descriptionError = false;
    this.isDescriptionEditing = false;
    this.updateJobPostInLocalStorage();
  }

  onDescriptionInput() {
    if (this.jobPost.description?.trim().length !== 0) {
      this.descriptionError = false;
    }
  }
  editDescription() {
    this.isDescriptionEditing = true;
  }
  onDurationSaved(updatedDuration: string) {
    this.jobPost.duration = updatedDuration; // Update the job post duration
    this.updateJobPostInLocalStorage(); // Save to local storage
  }
  openDurationModal() {
    if (this.durationModal) {
      this.isDurationModalOpen = true;
      this.durationModal.selectedDuration = this.jobPost.duration || '';
      this.durationModal.openModal(); // This method should already be defined in your modal component.
    }
  }
  onSkillsUpdated(updatedSkills: Skill[]) {
    this.jobPost.skills = updatedSkills; // Update the job post skills
    this.updateJobPostInLocalStorage(); // Save to local storage
  }
  onExperienceUpdated(updatedExperience: string) {
    this.jobPost.experience = updatedExperience; // Update the job post experience
    this.updateJobPostInLocalStorage(); // Save to local storage
  }

  openSkillModal() {
    if (this.skillModal) {
      this.isSkillModalOpen = true;
      this.skillModal.selectedSkills = this.jobPost.skills || []; // Pass the array correctly
      this.skillModal.openModal();
    }
  }
  openExperienceModal() {
    if (this.experienceModal) {
      this.isExperienceModalOpen = true;
      this.experienceModal.selectedExperience = this.jobPost.experience || ''; // Pass the array correctly
      this.experienceModal.openModal();
    }
  }
  openBudgetModal() {
    if (this.budgetModal) {
      this.isPriceModalOpen = true;
      this.budgetModal.selectedRate = this.jobPost.rate || ''; // Pass the array correctly
      this.budgetModal.priceFrom = this.jobPost.priceFrom || 0; // Pass the array correctly
      this.budgetModal.priceTo = this.jobPost.priceTo || 0; // Pass the array correctly
      this.budgetModal.openModal();
    }
  }
  onBudgetUpdated(updatedBudget: IJobPost) {
    this.jobPost.rate = updatedBudget.rate;
    this.jobPost.priceFrom = updatedBudget.priceFrom;
    this.jobPost.priceTo = updatedBudget.priceTo;
    this.updateJobPostInLocalStorage();
  }
  sendDataToBackend() {
    const jobPost = localStorage.getItem('jobPost');

    if (jobPost) {
      const jobPostData = JSON.parse(jobPost);
      this.jobService
        .sendJobPostData(jobPostData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            this.router.navigate(['client/job-posted']);
            console.log('Data successfully sent to the backend', response);
          },
          (error) => {
            console.error('Error sending data to the backend', error);
          }
        );
      console.log(
        jobPostData,
        'consoling before submittiong the data to the backend'
      );
    } else {
      console.error('No job post data found in local storage');
    }
  }
  handleConfirmModalClosed() {
    this.isConfirmModalOpen = false;
  }

  handleEditJobPostFromConfirm() {
    this.isConfirmModalOpen = false;
  }

  handleConfirmJobPosted() {
    this.isConfirmModalOpen = false;
    this.sendDataToBackend(); // Send data to the backend when the job is posted
  }
  ngOnDestroy() {
    // Emit a value to signal that the component is being destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}
