import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Category, Skill } from '../../types/category.model';
import { adminManagementService } from '../../service/admin-management.service';
import { Subscription } from 'rxjs';

// Custom validator function
function categoryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formValue = control.value;
    const subcategories = formValue.subcategories || [];
    const selectedSkills = formValue.skills || [];
    return subcategories.length > 0 && selectedSkills.length > 0
      ? null
      : {
          requiredFields:
            'At least one subcategory and one skill must be selected',
        };
  };
}

@Component({
  selector: 'app-add-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-category-modal.component.html',
  styleUrl: './add-category-modal.component.scss',
})
export class AddCategoryModalComponent implements OnInit, OnDestroy {
  @Output() categorySaved = new EventEmitter<Category>();
  @Output() categoryModalClosed = new EventEmitter<void>();

  categoryForm: FormGroup;
  subcategories: string[] = [];
  skills: Skill[] = [];

  selectedSkills: { id: string; name: string }[] = [];
  // Store selected skills as an array
  isCategoryModalOpen: boolean = true;
  subcategoryInputValue: string = '';
  private subscriptions: Subscription = new Subscription(); // Subscription management

  constructor(
    private fb: FormBuilder,
    private adminManagementService: adminManagementService
  ) {
    this.categoryForm = this.fb.group(
      {
        name: ['', Validators.required],
        description: [''],
        subcategoryName: [''],
        subcategories: [this.subcategories],
        skills: [this.selectedSkills],
      },
      { validators: categoryValidator() }
    );
  }

  ngOnInit(): void {
    this.fetchSkills();
  }

  private fetchSkills() {
    const skillSubscription = this.adminManagementService
      .getSkillsForCategory()
      .subscribe({
        next: (response: any) => {
          if (response && Array.isArray(response.skills)) {
            this.skills = response.skills;
            console.log(this.skills, 'consoling the skills from fetchskills');
          } else {
            console.error(
              'Skills data is not in the expected format:',
              response
            );
          }
        },
        error: (err: any) => {
          console.error('Error fetching skills:', err);
        },
      });
    this.subscriptions.add(skillSubscription); // Add subscription to the collection
  }

  openCategoryModal() {
    this.isCategoryModalOpen = true;
  }

  closeCategoryModal() {
    this.categoryModalClosed.emit();
    this.isCategoryModalOpen = false;
  }

  saveCategory(event: Event) {
    event.preventDefault();
    if (this.categoryForm.valid) {
      const { subcategoryName, ...formData } = this.categoryForm.value;
      formData.subcategories = this.subcategories;
      formData.skills = this.selectedSkills;
      this.isCategoryModalOpen = false;

      const category: Category = this.categoryForm.value;
      console.log(category, 'sendinggggg');
      const saveSubscription = this.adminManagementService
        .addCategory(category)
        .subscribe({
          next: (response) => {
            console.log('Category saved successfully:', response);
            this.categorySaved.emit(category);
            // Handle successful save, e.g., show a success message or redirect
          },
          error: (error: any) => {
            console.error('Error saving category:', error);
            // Handle error, e.g., show an error message
          },
        });
      this.subscriptions.add(saveSubscription); // Add subscription to the collection
    }
  }

  onSubcategoryInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.subcategoryInputValue = input.value;
  }

  addSubcategory() {
    if (this.subcategoryInputValue) {
      this.subcategories.push(this.subcategoryInputValue);
      this.categoryForm.controls['subcategoryName'].setValue('');
      this.subcategoryInputValue = '';
      this.categoryForm.updateValueAndValidity();
    }
  }

  clearSubcategoryInput() {
    this.subcategoryInputValue = '';
    this.categoryForm.controls['subcategoryName'].setValue('');
  }

  removeSubcategory(subcategory: string) {
    this.subcategories = this.subcategories.filter((sc) => sc !== subcategory);
    this.categoryForm.updateValueAndValidity();
  }

  onSkillSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedSkillId = select.value;

    const selectedSkill = this.skills.find(
      (skill) => skill._id === selectedSkillId
    );

    if (selectedSkill && selectedSkill._id) {
      this.addSkill({ id: selectedSkill._id, name: selectedSkill.name });
    } else {
      console.error('Selected skill is not valid:', selectedSkill);
    }

    this.categoryForm.updateValueAndValidity();
  }

  addSkill(skill: { id: string; name: string }) {
    if (skill.id && !this.selectedSkills.some((s) => s.id === skill.id)) {
      this.selectedSkills.push(skill);
    }
  }
  // Define the removeSelectedSkill method
  removeSelectedSkill(skillId: string) {
    this.selectedSkills = this.selectedSkills.filter((s) => s.id !== skillId);
    this.categoryForm.updateValueAndValidity();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up all subscriptions
  }
}
