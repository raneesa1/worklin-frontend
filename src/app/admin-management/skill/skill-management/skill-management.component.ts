import { Component, OnInit, ViewChild } from '@angular/core';
import { AddSkillsModalComponent } from '../add-skills-modal/add-skills-modal.component';
import { CommonModule } from '@angular/common';
import { Skill } from '../../../job-management/interfaces/skill';

import { EditSkillsModalComponent } from '../edit-skills-modal/edit-skills-modal.component';
import { BrowseModule } from '../../../browse/browse.module';
import { FormsModule } from '@angular/forms';
import { adminManagementService } from '../../service/admin-management.service';

@Component({
  selector: 'app-skill-management',
  standalone: true,
  imports: [
    AddSkillsModalComponent,
    CommonModule,
    EditSkillsModalComponent,
    BrowseModule,
    FormsModule,
  ],
  templateUrl: './skill-management.component.html',
  styleUrl: './skill-management.component.scss',
})
export class SkillManagementComponent implements OnInit {
  skills: Skill[] = [];
  filteredSkills: Skill[] = [];
  searchQuery: string = '';
  isModalOpen: boolean = false;
  isEditSkillModalOpen: boolean = false;
  selectedSkill: Skill | null = null;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private adminService: adminManagementService) {}

  ngOnInit(): void {
    this.fetchSkills();
  }
  fetchSkills(): void {
    this.adminService.getSkills(this.currentPage, this.itemsPerPage).subscribe(
      ({ skills, totalItems }) => {
        console.log('Fetched skills:', skills);
        this.skills = skills;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.filterSkills(); // Ensure filtered skills are updated after fetching
      },
      (error) => {
        console.error('Error fetching skills:', error);
      }
    );
  }

  filterSkills(): void {
    // Apply search filter
    this.filteredSkills = this.skills.filter((skill) =>
      skill.name
        ? skill.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        : false
    );
    this.updatePagination(); // Update pagination after filtering
  }
  private updatePagination(): void {
    // Calculate start and end indexes based on current page and items per page
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    // Slice the filtered skills for pagination
    this.filteredSkills = this.skills.slice(start, end);

    // Log the updated pagination for debugging
    console.log('Pagination updated:', this.filteredSkills);
  }

  addSkill(skill: Skill): void {
    this.skills.push(skill);
    this.filterSkills(); // Re-filter skills and update pagination
    this.closeModal();
  }

  handleSkillUpdate(updatedSkill: Skill): void {
    const index = this.skills.findIndex(
      (skill) => skill._id === updatedSkill._id
    );
    if (index !== -1) {
      this.skills[index] = updatedSkill;
      this.filterSkills(); // Re-filter skills and update pagination
    }
    this.closeEditSkillModal();
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  openEditSkillModal(skill: Skill): void {
    this.selectedSkill = skill;
    this.isEditSkillModalOpen = true;
  }

  closeEditSkillModal(): void {
    this.isEditSkillModalOpen = false;
    this.selectedSkill = null;
  }

  removeSkill(skill: Skill): void {
    if (skill._id) {
      this.adminService.deleteSkill(skill._id).subscribe(() => {
        this.skills = this.skills.filter((s) => s._id !== skill._id);
        this.filterSkills(); // Re-filter skills and update pagination
      });
    } else {
      console.error('Skill ID is undefined.');
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      console.log('Fetching previous page:', this.currentPage);
      this.fetchSkills(); // Fetch skills for the previous page
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      console.log('Fetching next page:', this.currentPage);
      this.fetchSkills();
    }
  }
}