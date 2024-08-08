import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor(private jobManagementService: adminManagementService) {}
  saveSkill() {
    if (this.skill && this.skill._id) {
      console.log(
        this.skill,
        'consoling the skills from save skills of edit skill'
      );
      this.jobManagementService
        .updateSkill(this.skill._id, this.skill)
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

  closeModal() {
    this.onClose.emit();
  }
}
