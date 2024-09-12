import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditAddressModalComponent } from '../edit-address-modal/edit-address-modal.component';
import { EditExperienceFromPreviewModalComponent } from '../edit-experience-from-preview-modal/edit-experience-from-preview-modal.component';
import { EditEducationFromPreviewModalComponent } from '../edit-education-from-preview-modal/edit-education-from-preview-modal.component';
import { EditSkillFromPreviewModalComponent } from '../edit-skill-from-preview-modal/edit-skill-from-preview-modal.component';
import { PhotoUploadModalComponent } from '../photo-upload-modal/photo-upload-modal.component';
import { EditBioFromPreviewModalComponent } from '../edit-bio-from-preview-modal/edit-bio-from-preview-modal.component';
import { EditRateFromPreviewModalComponent } from '../edit-rate-from-preview-modal/edit-rate-from-preview-modal.component';
import { EditLanguageFromPreviewModalComponent } from '../edit-language-from-preview-modal/edit-language-from-preview-modal.component';
import { catchError, of, Subscription } from 'rxjs';
import { Skill } from '../../../admin-management/types/category.model';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';
import { Experience } from '../../../../shared/types/interfaces/experience';
import { Education } from '../../../../shared/types/interfaces/education';
import { ILanguage } from '../../../../shared/types/ILanguage';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    EditAddressModalComponent,
    EditExperienceFromPreviewModalComponent,
    EditEducationFromPreviewModalComponent,
    EditSkillFromPreviewModalComponent,
    PhotoUploadModalComponent,
    EditBioFromPreviewModalComponent,
    EditRateFromPreviewModalComponent,
    EditLanguageFromPreviewModalComponent,
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent implements OnInit {
  isAddressModalOpen = false;
  isExperienceModalOpen = false;
  isEducationModalOpen = false;
  isSkillModalOpen = false;
  isBioModalOpen = false;
  isRateModalOpen = false;
  freelancer: FreelancerEntity = {
    firstName: '',
    email: '',
    phoneNumber: 0,
    accountType: '',
    subCategory: [],
    bio: '',
    role: '',
    picture: '',
    country: '',
    isBlocked: false,
    resume: '',
    category: [],
    experience: [],
    education: [],
    dob: '',
    languages: [],
    isProfileCompleted: false,
    address: [],
    hourlyRate: 0,
    serviceRate: 0,
    freelancedBefore: '',
    freelancingGoal: '',
    skill: [],
  };

  @ViewChild(EditAddressModalComponent)
  addressModal!: EditAddressModalComponent;

  @ViewChild(EditExperienceFromPreviewModalComponent)
  experienceModal!: EditExperienceFromPreviewModalComponent;

  @ViewChild(EditEducationFromPreviewModalComponent)
  educationModal!: EditEducationFromPreviewModalComponent;

  @ViewChild(EditSkillFromPreviewModalComponent)
  skillModal!: EditSkillFromPreviewModalComponent;

  @ViewChild(EditBioFromPreviewModalComponent)
  bioModal!: EditBioFromPreviewModalComponent;

  @ViewChild(EditRateFromPreviewModalComponent)
  rateModal!: EditRateFromPreviewModalComponent;

  @ViewChild(EditLanguageFromPreviewModalComponent)
  languageModal!: EditLanguageFromPreviewModalComponent;
  private subscription = new Subscription();
  constructor(
    private router: Router,
    private profileManagementService: ProfileManagementService
  ) {}

  ngOnInit(): void {
    const freelancerData = localStorage.getItem('freelancer');
    if (freelancerData) {
      this.freelancer = JSON.parse(freelancerData);
    }
  }
  openAddressModal() {
    if (this.addressModal && this.freelancer?.address?.[0]) {
      this.isAddressModalOpen = true;
      this.addressModal.address = { ...this.freelancer.address[0] }; // Pass a copy of the address object
      this.addressModal.openModal();
    }
  }

  updateFreelancerAddress(updatedAddress: any) {
    if (this.freelancer?.address) {
      this.freelancer.address[0] = updatedAddress;
      // Save the updated freelancer data back to local storage
      localStorage.setItem('freelancer', JSON.stringify(this.freelancer));
    }
  }
  openExperienceModal() {
    if (this.experienceModal) {
      console.log('clicked');
      this.isExperienceModalOpen = true;
      this.experienceModal.experiences = this.freelancer.experience;
      this.experienceModal.openModal();
    }
  }

  updateFreelancerExperience(updatedExperiences: Experience[]) {
    this.freelancer.experience = updatedExperiences;
    localStorage.setItem('freelancer', JSON.stringify(this.freelancer));
  }
  openEducationModal() {
    if (this.educationModal) {
      console.log('clicked');
      this.isEducationModalOpen = true;
      this.educationModal.educations = this.freelancer.education;
      this.educationModal.openModal();
    }
  }

  updateFreelancerEducation(updatedEducation: Education[]) {
    console.log('Updating education with:', updatedEducation);
    this.freelancer.education = updatedEducation;
    // Save the updated freelancer data back to local storage
    localStorage.setItem('freelancer', JSON.stringify(this.freelancer));
  }
  openSkillModal() {
    if (this.skillModal) {
      this.isSkillModalOpen = true;

      // Extract skills from category array
      const skills: Skill[] = [];
      this.freelancer.category.forEach((category) => {
        if (category.skills) {
          skills.push(...category.skills);
        }
      });

      this.skillModal.selectedSkills = this.freelancer.skill;
      this.skillModal.skills = skills;
      this.skillModal.openEditSkillsModal();
    }
  }

  updateFreelancerSkill(updatedSkill: Skill[]) {
    console.log('Updating education with:', updatedSkill);
    this.freelancer.skill = updatedSkill;
    localStorage.setItem('freelancer', JSON.stringify(this.freelancer));
  }

  onImageUploaded(imageUrl: string) {
    this.freelancer.picture = imageUrl;
    console.log(imageUrl, 'consoling the image url from location ts file');
    localStorage.setItem('freelancer', JSON.stringify(this.freelancer));
  }
  openBioModal() {
    if (this.bioModal) {
      console.log('clicked');
      this.isBioModalOpen = true;
      this.bioModal.freelancer = this.freelancer;
      this.bioModal.openModal();
    }
  }
  updateFreelancerBio(freelancer: FreelancerEntity) {
    this.freelancer = freelancer;
    localStorage.setItem('freelancer', JSON.stringify(this.freelancer));
  }
  openRateModal() {
    if (this.rateModal) {
      this.isRateModalOpen = true;
      this.rateModal.freelancer = this.freelancer;
      this.rateModal.openEditRateModal();
    }
  }
  updateFreelancerRate(freelancer: FreelancerEntity) {
    this.freelancer = freelancer;
    localStorage.setItem('freelancer', JSON.stringify(this.freelancer));
  }
  openLanguageModal() {
    if (this.languageModal) {
      this.isRateModalOpen = true;
      this.languageModal.languages = this.freelancer.languages;
      this.languageModal.openModal();
    }
  }
  updateFreelancerLanguage(language: ILanguage[]) {
    this.freelancer.languages = language;
    localStorage.setItem('freelancer', JSON.stringify(this.freelancer));
  }
  submitProfile() {
    console.log(this.freelancer, 'cons');
    const subscription = this.profileManagementService
      .editProfile(this.freelancer)
      .pipe(
        catchError((error) => {
          // Handle error
          console.error('Error:', error);
          return of(null);
        })
      )
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['freelancer/profileCreated']);
            console.log('Profile updated successfully:', response);
          } else {
            console.log('No response received.');
          }
        },
        (error) => {
          console.error('Update failed:', error);
        }
      );

    // Add the subscription to the subscription object
    this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
