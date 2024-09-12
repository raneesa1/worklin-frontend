import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillsComponent } from '../skills/skills.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/reducers';
import {
  selectCategory,
  clearCategorySelection,
  selectSubcategory,
  clearSubcategorySelection,
} from '../../../../state/actions/category.actions';
import { roleService } from '../../../../shared/service/role.service';
import {
  Category,
  SubCategory,
} from '../../../admin-management/types/category.model';
import { adminManagementService } from '../../../admin-management/service/admin-management.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, SkillsComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  categories: Category[] = [];
  isSelected = false;
  selectedCategory: Category | null = null;
  selectedSubcategories: SubCategory[] = [];
  showValidationError = false;

  constructor(
    private adminManagementService: adminManagementService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.adminManagementService.getAllCategories().subscribe({
      next: (response: { message: string; categories: Category[] }) => {
        this.categories = response.categories;
        console.log('Categories fetched:', this.categories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
      complete: () => {
        console.log('Category fetching complete.');
      },
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.store.dispatch(selectCategory({ category }));
    this.showValidationError = false;
    console.log(this.selectedCategory, 'Selected category');
  }

  toggleSubcategory(subcategory: SubCategory): void {
    const index = this.selectedSubcategories.findIndex(
      (cat) => cat.id === subcategory.id
    );
    if (index === -1) {
      this.selectedSubcategories.push(subcategory);
      this.store.dispatch(selectSubcategory({ subcategory }));
    } else {
      this.selectedSubcategories.splice(index, 1);
      this.store.dispatch(clearSubcategorySelection());
      this.selectedSubcategories.forEach((cat) => {
        this.store.dispatch(selectSubcategory({ subcategory: cat }));
      });
    }
    this.showValidationError = false;
    console.log(this.selectedSubcategories, 'Selected subcategories');
  }

  clearSelections(): void {
    this.selectedCategory = null;
    this.selectedSubcategories = [];
    this.store.dispatch(clearCategorySelection());
  }

  onSubmit(): void {
    if (this.selectedCategory && this.selectedSubcategories.length > 0) {
      console.log(
        this.selectCategory,
        this.selectedSubcategories,
        'consoling the category'
      );
      this.isSelected = true;
    } else {
      this.showValidationError = true; // Show validation error if not selected
    }
  }

  isButtonDisabled(): boolean {
    return !(this.selectedCategory && this.selectedSubcategories.length > 0);
  }
}
