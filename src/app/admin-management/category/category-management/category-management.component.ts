// category-management.component.ts
import { Component, OnInit } from '@angular/core';
// import { CategoryService } from './category.service'; // Adjust the import based on your project structure
import { Category, Skill, SubCategory } from '../../types/category.model'; // Adjust the import based on your project structure
import { CommonModule } from '@angular/common';
import { BrowseModule } from '../../../browse/browse.module';
import { FormsModule } from '@angular/forms';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';
import { adminManagementService } from '../../service/admin-management.service';
import { concatAll } from 'rxjs';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
  imports: [CommonModule, BrowseModule, FormsModule, AddCategoryModalComponent],
  standalone: true,
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isCategoryModalOpen = false;
  isEditCategoryModalOpen = false;
  selectedCategory: Category | null = null;
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  constructor(private categoryService: adminManagementService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: { message: string; categories: Category[] }) => {
        this.categories = response.categories;
        this.filteredCategories = [...this.categories]; // Display all categories without filtering
        // this.updatePagination();
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

  filterCategories(): void {
    //   const query = this.searchQuery.toLowerCase();
    //   this.filteredCategories = this.categories.filter(
    //     (category) =>
    //       category.name.toLowerCase().includes(query) ||
    //       category?.description?.toLowerCase().includes(query) ||
    //       category.subCategories?.some((sub) =>
    //         sub?.toLowerCase().includes(query)
    //       ) ||
    //       category?.skills?.some((skill) =>
    //         skill.name.toLowerCase().includes(query)
    //       )
    //   );
    //   this.updatePagination();
  }

  // updatePagination(): void {
  //   this.totalPages = Math.ceil(
  //     this.filteredCategories.length / this.itemsPerPage
  //   );
  //   this.updatePage();
  // }

  // updatePage(): void {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;
  //   this.filteredCategories = this.filteredCategories.slice(start, end);
  // }

  handleCategorySave(category: Category) {
    // Handle the category data, e.g., update category list
    console.log('Category received:', category);
    this.isCategoryModalOpen = false
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
    //   this.categoryService.updateCategory(updatedCategory).subscribe(() => {
    //     const index = this.categories.findIndex(
    //       (c) => c.id === updatedCategory.id
    //     );
    //     if (index !== -1) {
    //       this.categories[index] = updatedCategory;
    //       this.filteredCategories[index] = updatedCategory;
    //       this.filterCategories();
    //       this.closeEditCategoryModal();
    //     }
    //   });
  }

  removeCategory(category: Category): void {
    //   this.categoryService.deleteCategory(category.id).subscribe(() => {
    //     this.categories = this.categories.filter((c) => c.id !== category.id);
    //     this.filteredCategories = this.filteredCategories.filter(
    //       (c) => c.id !== category.id
    //     );
    //     this.filterCategories();
    //   });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      // this.updatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      // this.updatePage();
    }
  }
}