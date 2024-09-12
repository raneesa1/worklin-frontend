import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AddEducationModalComponent } from '../add-education-modal/add-education-modal.component';
import { CommonModule } from '@angular/common';
import { roleService } from '../../../../shared/service/role.service';
import { EditEducationModalComponent } from '../edit-education-modal/edit-education-modal.component';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { Education } from '../../../../shared/types/interfaces/education';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    AddEducationModalComponent,
    EditEducationModalComponent,
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  education: Education[] = [];
  selectedEducation: Education | null = null;
  errorMessage: string | null = null;
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;

  constructor(
    private profileService: ProfileManagementService,
    private roleService: roleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEducationData();
  }

  openModal() {
    this.isModalOpen = true;
  }

  openEditModal(education: Education) {
    this.selectedEducation = { ...education };
    console.log('clicked');
    this.isEditModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  getEducationData(): void {
    const userId = this.roleService.getUserId();
    if (!userId) {
      return console.log('userId is required');
    }
    this.profileService.getEducation(userId).subscribe(
      (data: Education[]) => {
        this.education = data;
        console.log(this.education, 'consoling the edu details');
      },
      (error) => {
        console.error('Error fetching education data:', error);
      }
    );
  }

  // Add new education entry
  addEducation(newEducation: Education) {
    this.education.push(newEducation);
    this.errorMessage = null;
    this.closeModal();
  }

  deleteEducation(educationId: string): void {
    console.log(educationId, 'consoling the education id');
    if (confirm('Are you sure you want to delete this education entry?')) {
      this.profileService.deleteEducation(educationId).subscribe(
        () => {
          // Remove the deleted entry from the list
          this.education = this.education.filter((e) => e._id !== educationId);
          console.log('Education entry deleted successfully.');
        },
        (error) => {
          console.error('Error deleting education entry:', error);
        }
      );
    }
  }

  saveEducation(editEducationForm: any) {
    if (editEducationForm.valid && this.selectedEducation) {
      this.updateEducation(this.selectedEducation);
    }
  }
  updateEducation(editedEducation: Education) {
    const userId = this.roleService.getUserId();
    if (!userId || !editedEducation._id) {
      return console.error('User ID and Education ID are required');
    }

    const updatedData = { ...editedEducation, userId };

    console.log(updatedData, 'consoling the updated data from frontend');
    this.profileService
      .updateEducation(editedEducation._id, updatedData)
      .subscribe(
        (response) => {
          if (response.success) {
            const index = this.education.findIndex(
              (e) => e._id === editedEducation._id
            );
            if (index !== -1) {
              this.education[index] = editedEducation; // Update the entry in the list
            }
            this.isEditModalOpen = false; // Close the edit modal
          } else {
            console.error(
              'Failed to update education entry:',
              response.message
            );
          }
        },
        (error) => {
          console.error('Error updating education entry:', error);
        }
      );
  }

  onNext() {
    if (this.education.length === 0) {
      this.errorMessage =
        'Please add at least one education entry before proceeding.';
    } else {
      this.errorMessage = null;
      this.router.navigate(['/freelancer/create-account-language']);
    }
  }
}
