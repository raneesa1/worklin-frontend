import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Skill } from '../../../admin-management/types/category.model';

@Component({
  selector: 'app-edit-skill-from-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-skill-from-preview-modal.component.html',
  styleUrl: './edit-skill-from-preview-modal.component.scss',
})
export class EditSkillFromPreviewModalComponent {
  @Output() skillsUpdated = new EventEmitter<Skill[]>();
  isEditSkillsModalOpen = false;
  skills: Skill[] = [];
  localSelectedSkills: Skill[] = [];
  selectedSkills: Skill[] = [];

  openEditSkillsModal() {
    this.isEditSkillsModalOpen = true;
    this.localSelectedSkills = [...this.selectedSkills];
  }

  closeEditSkillsModal() {
    this.isEditSkillsModalOpen = false;
  }

  saveSkills() {
    this.selectedSkills = [...this.localSelectedSkills];
    this.skillsUpdated.emit(this.selectedSkills);
    console.log('Saved Skills:', this.selectedSkills);
    this.closeEditSkillsModal();
  }

  onSkillSelected(event: Event) {
    const skillId = (event.target as HTMLSelectElement).value;
    const selectedSkill = this.skills.find((skill) => skill._id === skillId);

    if (
      selectedSkill &&
      !this.localSelectedSkills.some((skill) => skill._id === skillId)
    ) {
      this.localSelectedSkills.push(selectedSkill);
    }
  }

  removeSelectedSkill(skillId?: string): void {
    this.localSelectedSkills = this.localSelectedSkills.filter(
      (skill) => skill._id !== skillId
    );
  }
}
