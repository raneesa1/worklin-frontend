import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Category, SubCategory } from '../../../admin-management/types/category.model';
import { adminManagementService } from '../../../admin-management/service/admin-management.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillsComponent } from '../skills/skills.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/reducers';
import {
  selectCategory,
  clearCategorySelection,
  selectSubcategory,
  clearSubcategorySelection,
} from '../../../state/actions/category.actions';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  selectedSubcategories: SubCategory[] = [];

  constructor(
    private adminManagementService: adminManagementService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.adminManagementService.getCategories().subscribe({
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
    console.log(this.selectedSubcategories, 'Selected subcategories');
  }

  clearSelections(): void {
    this.selectedCategory = null;
    this.selectedSubcategories = [];
    this.store.dispatch(clearCategorySelection());
  }
}


