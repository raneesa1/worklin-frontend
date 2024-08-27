import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Skill } from '../../../job-management/interfaces/skill';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { adminManagementService } from '../../service/admin-management.service';


@Component({
  selector: 'app-edit-skills-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-skills-modal.component.html',
  styleUrl: './edit-skills-modal.component.scss',
})
export class EditSkillsModalComponent {
  @Input() skill: Skill = { name: '', description: '' };
  @Output() onUpdate = new EventEmitter<Skill>();
  @Output() onClose = new EventEmitter<void>();

  editedSkill: Skill = { name: '', description: '' };

  constructor(private jobManagementService: adminManagementService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skill'] && changes['skill'].currentValue) {
      this.editedSkill = { ...this.skill }; // Update the local copy with new skill data
    }
  }

  saveSkill(): void {
    if (this.editedSkill && this.editedSkill._id) {
      this.jobManagementService
        .updateSkill(this.editedSkill._id, this.editedSkill)
        .subscribe({
          next: (updatedSkill: Skill) => {
            this.onUpdate.emit(updatedSkill);
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Error updating skill', error);
          },
        });
    }
  }

  closeModal(): void {
    this.onClose.emit();
  }

  resetSkill(): void {
    this.editedSkill = { ...this.skill };
  }
}