// category-management.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
// import { CategoryService } from './category.service'; // Adjust the import based on your project structure
import { Category, Skill, SubCategory } from '../../types/category.model'; // Adjust the import based on your project structure
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';
import { adminManagementService } from '../../service/admin-management.service';
import { concatAll } from 'rxjs';
import { BrowseModule } from '../../../../browse/browse.module';
import { AdminNavbarComponent } from '../../../../components/admin-navbar/admin-navbar.component';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    AddCategoryModalComponent,
    AdminNavbarComponent,
  ],
  standalone: true,
})
export class CategoryManagementComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isCategoryModalOpen = false;
  isEditCategoryModalOpen = false;
  selectedCategory: Category | null = null;
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 0;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private categoryService: adminManagementService) {}
  ngOnInit(): void {
    this.loadCategories();
    this.setupSearchDebounce();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  setupSearchDebounce(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadCategories();
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  loadCategories(): void {
    this.categoryService
      .getCategories(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe({
        next: (response: {
          categories: Category[];
          totalItems: number;
          totalPages: number;
        }) => {
          this.categories = response.categories;
          this.filteredCategories = [...this.categories];
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
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

  handleCategorySave(category: Category) {
    // Handle the category data, e.g., update category list
    console.log('Category received:', category);
    this.isCategoryModalOpen = false;
    this.loadCategories();
    // Add logic to save the category to your list or server
  }

  openCategoryModal(): void {
    this.isCategoryModalOpen = true;
  }

  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
  }

  addCategory(category: Category): void {
    this.categoryService
      .addCategory(category)
      .subscribe((newCategory: Category) => {
        this.categories.push(newCategory);
        this.filteredCategories.push(newCategory);
        // this.filterCategories();
        this.closeCategoryModal();
      });
  }

  openEditCategoryModal(category: Category): void {
    this.selectedCategory = category;
    this.isEditCategoryModalOpen = true;
  }

  closeEditCategoryModal(): void {
    this.isEditCategoryModalOpen = false;
    this.selectedCategory = null;
  }

  handleCategoryUpdate(updatedCategory: Category): void {
    // this.categoryService.updateCategory(updatedCategory).subscribe(() => {
    //   const index = this.categories.findIndex(
    //     (c) => c.id === updatedCategory.id
    //   );
    //   if (index !== -1) {
    //     this.categories[index] = updatedCategory;
    //     this.filteredCategories[index] = updatedCategory;
    //     this.filterCategories();
    //     this.closeEditCategoryModal();
    //   }
    // });
  }

  removeCategory(categoryId: string): void {
    // Call the deleteCategory method from the service
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        // On successful deletion, remove the category from the arrays
        this.categories = this.categories.filter(
          (category) => category._id !== categoryId
        );
        this.filteredCategories = this.filteredCategories.filter(
          (category) => category._id !== categoryId
        );
        console.log('Category deleted successfully');
      },
      error: (error) => {
        // Handle errors if the deletion fails
        console.error('Error deleting category:', error);
      },
      complete: () => {
        console.log('Delete category operation complete.');
      },
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCategories();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCategories();
    }
  }
}
