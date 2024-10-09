import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { adminManagementService } from '../../service/admin-management.service';
import { BrowseModule } from '../../../../browse/browse.module';
import { Skill } from '../../types/category.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-skills-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-skills-modal.component.html',
  styleUrl: './add-skills-modal.component.scss',
})
export class AddSkillsModalComponent {
  @Input() skill: Skill = {} as Skill;
  @Input() isModalOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Skill>();

  skillForm: FormGroup;
  private destroy$ = new Subject<void>();

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
      this.skillService
        .addSkill(this.skill)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.save.emit(response.skill);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
