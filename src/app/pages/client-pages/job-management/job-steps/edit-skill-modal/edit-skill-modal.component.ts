import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Skill } from '../../interfaces/skill';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jobManagementService } from '../../service/job-management.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-skill-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-skill-modal.component.html',
  styleUrl: './edit-skill-modal.component.scss',
})
export class EditSkillModalComponent {
  skills: Skill[] = [];
  @Input() selectedSkills: Skill[] = [];
  @Output() updateSkills = new EventEmitter<Skill[]>();
  @Output() closeModal = new EventEmitter<void>();
  isSkillModalOpen = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  selectedSkill: Skill | null = null;
  private destroy$ = new Subject<void>();

  constructor(private jobService: jobManagementService) {}
  ngOnInit() {
    this.getSkills();
  }

  getSkills() {
    this.jobService
      .getSkills(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.skills = response.skills;
          this.totalItems = response.totalItems;
        },
        (error) => {
          console.error('Error fetching skills', error);
        }
      );
  }
  addSkill() {
    if (
      this.selectedSkill &&
      !this.selectedSkills.includes(this.selectedSkill)
    ) {
      this.selectedSkills.push(this.selectedSkill);
      this.selectedSkill = null; // Clear dropdown selection
    }
  }

  removeSkill(skill: Skill) {
    this.selectedSkills = this.selectedSkills.filter((s) => s !== skill);
  }

  saveChanges() {
    this.updateSkills.emit(this.selectedSkills);
    this.closeModal.emit();
    this.isSkillModalOpen = false; // Close the modal after saving
  }

  openModal() {
    this.isSkillModalOpen = true;
  }
  close() {
    this.isSkillModalOpen = false;
  }
  ngOnDestroy() {
    // Emit a value to signal that the component is being destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}
