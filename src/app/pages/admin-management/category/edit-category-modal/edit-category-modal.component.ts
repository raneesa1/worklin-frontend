import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-category-modal',
  standalone: true,
  imports: [],
  templateUrl: './edit-category-modal.component.html',
  styleUrl: './edit-category-modal.component.scss',
})
export class EditCategoryModalComponent {
  @Input() isCategoryModalOpen = false;
  @Input() category: any = {};
  @Input() skills: any[] = [];
  @Output() categoryUpdated = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  categoryForm: FormGroup;
  subcategories: string[] = [];
  selectedSkills: any[] = [];
  subcategoryInputValue: string = '';

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      subcategoryName: [''],
    });
  }

  ngOnInit(): void {
    if (this.category) {
      this.categoryForm.patchValue({
        name: this.category.name,
        description: this.category.description,
      });
      this.subcategories = this.category.subcategories || [];
      this.selectedSkills = this.category.skills || [];
    }
  }

  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
    this.modalClosed.emit();
  }

  saveCategory(event: Event): void {
    event.preventDefault();

    if (this.categoryForm.invalid) {
      this.categoryForm.setErrors({
        requiredFields: 'Please fill in all required fields.',
      });
      return;
    }

    const updatedCategory = {
      ...this.category,
      ...this.categoryForm.value,
      subcategories: this.subcategories,
      skills: this.selectedSkills,
    };

    this.categoryUpdated.emit(updatedCategory);
    this.closeCategoryModal();
  }

  onSubcategoryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.subcategoryInputValue = input.value;
  }

  addSubcategory(): void {
    if (
      this.subcategoryInputValue &&
      !this.subcategories.includes(this.subcategoryInputValue)
    ) {
      this.subcategories.push(this.subcategoryInputValue);
      this.subcategoryInputValue = '';
    }
  }

  removeSubcategory(subcategory: string): void {
    this.subcategories = this.subcategories.filter((sc) => sc !== subcategory);
  }

  clearSubcategoryInput(): void {
    this.subcategoryInputValue = '';
  }

  onSkillSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedSkill = this.skills.find(
      (skill) => skill._id === select.value
    );

    if (selectedSkill && !this.selectedSkills.includes(selectedSkill)) {
      this.selectedSkills.push(selectedSkill);
    }
  }

  removeSelectedSkill(skillId: string): void {
    this.selectedSkills = this.selectedSkills.filter(
      (skill) => skill._id !== skillId
    );
  }
}
