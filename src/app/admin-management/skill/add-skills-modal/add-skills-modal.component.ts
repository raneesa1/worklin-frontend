import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrowseModule } from '../../../browse/browse.module';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Skill } from '../../../job-management/interfaces/skill';
import { adminManagementService } from '../../service/admin-management.service';


@Component({
  selector: 'app-add-skills-modal',
  standalone: true,
  imports: [CommonModule, BrowseModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-skills-modal.component.html',
  styleUrl: './add-skills-modal.component.scss',
})
export class AddSkillsModalComponent {
  @Input() skill: Skill = { name: '', description: '' };
  @Input() isModalOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  skillForm: FormGroup;

  constructor(
    private skillService: adminManagementService,
    private fb: FormBuilder
  ) {
    this.skillForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  closeModal() {
    this.close.emit();
  }

  saveSkill(event: Event) {
    event.preventDefault();
    if (this.skillForm.valid) {
      // Prevent form submission from refreshing the page
      this.skill = this.skillForm.value;

      console.log(this.skill, 'consoling the skills');
      this.skillService.addSkill(this.skill).subscribe({
        next: (savedSkill: Skill) => {
          this.save.emit(savedSkill);
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Error saving skill:', err);
        },
      });
    }
    // this.save.emit(this.skill);
    // this.closeModal();
    // Close the modal after saving
  }
}
