import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { CommonModule } from '@angular/common';
import { roleService } from '../../../shared/service/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileManagementService } from '../../../shared/service/profile-management.service';
import { FreelancerEntity } from '../../../shared/types/FreelancerEntity';
import { ChatService } from '../../../shared/service/chat.service';
import { EditEducationModalComponent } from '../create-account-freelancer/edit-education-modal/edit-education-modal.component';
import { EditLanguageFromPreviewModalComponent } from '../create-account-freelancer/edit-language-from-preview-modal/edit-language-from-preview-modal.component';
import { EditExperienceFromPreviewModalComponent } from '../create-account-freelancer/edit-experience-from-preview-modal/edit-experience-from-preview-modal.component';
import { Experience } from '../../../shared/types/interfaces/experience';
import { EditSkillFromPreviewModalComponent } from '../create-account-freelancer/edit-skill-from-preview-modal/edit-skill-from-preview-modal.component';
import { Skill } from '../../admin-management/types/category.model';
import { ILanguage } from '../../../shared/types/ILanguage';
import { EditBioFromPreviewModalComponent } from '../create-account-freelancer/edit-bio-from-preview-modal/edit-bio-from-preview-modal.component';
import { EditEducationFromPreviewModalComponent } from '../create-account-freelancer/edit-education-from-preview-modal/edit-education-from-preview-modal.component';
import { Education } from '../../../shared/types/interfaces/education';
import { EditRateFromPreviewModalComponent } from '../create-account-freelancer/edit-rate-from-preview-modal/edit-rate-from-preview-modal.component';
import { AddVideoIntroductionModalComponent } from '../add-video-introduction-modal/add-video-introduction-modal.component';

@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [
    NavbarAfterLoginComponent,
    CommonModule,
    EditEducationModalComponent,
    EditExperienceFromPreviewModalComponent,
    EditLanguageFromPreviewModalComponent,
    EditSkillFromPreviewModalComponent,
    EditLanguageFromPreviewModalComponent,
    EditBioFromPreviewModalComponent,
    EditEducationFromPreviewModalComponent,
    EditRateFromPreviewModalComponent,
    AddVideoIntroductionModalComponent,
  ],
  templateUrl: './freelancer-profile.component.html',
  styleUrl: './freelancer-profile.component.scss',
})
export class FreelancerProfileComponent implements OnInit {
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
    hourlyRate: 0,
    serviceRate: 0,
    freelancedBefore: '',
    freelancingGoal: '',
    skill: [],
  };
  loading: boolean = true;
  error: string | null = null;
  currentUserRole: string = 'client';
  currentTime: string = '';
  showExperienceModal: boolean = false;
  isSkillModalOpen: boolean = false;
  isLanguageModalOpen: boolean = false;
  isBioModalOpen: boolean = false;
  isEducationModalOpen: boolean = false;
  isRateModalOpen: boolean = false;
  isVideoIntroductionModalOpen: boolean = false;

  @ViewChild(EditExperienceFromPreviewModalComponent)
  experienceModal!: EditExperienceFromPreviewModalComponent;

  @ViewChild(EditSkillFromPreviewModalComponent)
  skillsModal!: EditSkillFromPreviewModalComponent;

  @ViewChild(EditLanguageFromPreviewModalComponent)
  languageModal!: EditLanguageFromPreviewModalComponent;

  @ViewChild(EditBioFromPreviewModalComponent)
  bioModal!: EditBioFromPreviewModalComponent;

  @ViewChild(EditEducationFromPreviewModalComponent)
  educationModal!: EditEducationFromPreviewModalComponent;

  @ViewChild(EditRateFromPreviewModalComponent)
  rateModal!: EditRateFromPreviewModalComponent;

  constructor(
    private profileService: ProfileManagementService,
    private roleService: roleService,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private router: Router
  ) {}
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const freelancerId = params.get('id');
      console.log('Freelancer ID from route params:', freelancerId);

      // If no freelancer ID from the route, get the user ID from the token
      if (freelancerId) {
        this.loadFreelancerProfile(freelancerId);
      } else if (this.roleService.isRole('freelancer')) {
        const tokenFreelancerId = this.roleService.getUserId();
        this.currentUserRole = 'freelancer';
        console.log('Freelancer ID from token:', tokenFreelancerId);
        this.loadFreelancerProfile(tokenFreelancerId);
      } else {
        this.error = 'No freelancer ID provided and user is not a freelancer';
        this.loading = false;
      }
    });

    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 60000); // Update time every minute
  }

  loadFreelancerProfile(freelancerId: string) {
    this.loading = true;
    this.profileService.getFreelancerProfile(freelancerId).subscribe({
      next: (data) => {
        this.freelancer = { ...this.freelancer, ...data };
        this.loading = false;
        console.log(this.freelancer, 'consoling the freeelancer info');
      },
      error: (err) => {
        this.error = 'Failed to load freelancer profile';
        this.loading = false;
        console.error('Error loading freelancer profile:', err);
      },
    });
  }

  updateCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  sendMessage() {
    const senderId = this.roleService.getUserId(); // Assuming you have a method to get the current user's ID
    const receiverId = this.freelancer._id; // Assuming `freelancer.id` holds the freelancer's ID

    if (!receiverId) {
      console.error('Receiver ID is undefined');
      return; // Optionally show a UI message to the user here
    }
    const messageData = {
      sender: senderId,
      receiver: receiverId,
    };

    this.chatService.createRoom(messageData).subscribe({
      next: (response) => {
        console.log('Room created:', response);
        if (response.success) {
          this.router.navigate(['/client/messages']); // Redirect to the messages page
        }
      },
      error: (error) => {
        console.error('Error creating room:', error);
      },
    });
  }
  openEditExperienceModal() {
    if (this.experienceModal) {
      console.log('clicked');
      this.showExperienceModal = true;
      this.experienceModal.experiences = this.freelancer.experience;
      this.experienceModal.openModal();
    }
  }

  closeEditExperienceModal() {
    this.showExperienceModal = false;
  }

  saveExperienceChanges(updatedExperiences: Experience[]) {
    this.freelancer.experience = updatedExperiences;
    this.closeEditExperienceModal();
  }

  cancelExperienceChanges() {
    this.closeEditExperienceModal();
  }
  openSkillModal() {
    if (this.skillsModal) {
      this.isSkillModalOpen = true;

      const skills: Skill[] = [];
      this.freelancer.category.forEach((category) => {
        if (category.skills) {
          skills.push(...category.skills);
        }
      });
      console.log(this.freelancer.category, 'consoling the category');
      console.log(
        skills,
        'consoling the skills in opening the edit skills modal'
      );
      this.skillsModal.selectedSkills = this.freelancer.skill;
      this.skillsModal.skills = skills;
      this.skillsModal.openEditSkillsModal();
    }
  }
  updateFreelancerSkill(updatedSkill: Skill[]) {
    this.freelancer.skill = updatedSkill;
    this.closeEditSkillsModal();
  }
  hireFreelancer(freelancer: FreelancerEntity) {
    // Navigate to the set-offer page with freelancer data
    this.router.navigate(['client/set-offer'], {
      state: { freelancer: freelancer },
    });
  }

  cancelSkillsChanges() {
    this.closeEditSkillsModal();
  }
  closeEditSkillsModal() {
    this.isSkillModalOpen = false;
  }
  openLanguageModal() {
    if (this.languageModal) {
      this.isLanguageModalOpen = true;
      this.languageModal.languages = this.freelancer.languages;
      this.languageModal.openModal();
    }
  }
  updateFreelancerLanguage(language: ILanguage[]) {
    this.freelancer.languages = language;
    this.closeLanguageModal();
  }
  closeLanguageModal() {
    this.isLanguageModalOpen = false;
  }

  openBioModal() {
    if (this.bioModal) {
      console.log('clickeddddddd');
      this.isBioModalOpen = true;
      this.bioModal.freelancer = this.freelancer;
      this.bioModal.openModal();
    }
  }
  updateFreelancerBio(freelancer: FreelancerEntity) {
    this.freelancer = freelancer;
    this.isBioModalOpen = false;
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
    this.isEducationModalOpen = false;
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
    this.isRateModalOpen = false;
  }
  openVideoIntroductionModalOpen() {
    this.isVideoIntroductionModalOpen = true;
  }
}
