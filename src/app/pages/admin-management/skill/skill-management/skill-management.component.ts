import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AddSkillsModalComponent } from '../add-skills-modal/add-skills-modal.component';
import { CommonModule } from '@angular/common';

import { EditSkillsModalComponent } from '../edit-skills-modal/edit-skills-modal.component';
import { FormsModule } from '@angular/forms';
import { adminManagementService } from '../../service/admin-management.service';
import { Skill } from '../../types/category.model';
import { BrowseModule } from '../../../../browse/browse.module';
import { AdminNavbarComponent } from '../../../../components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-skill-management',
  standalone: true,
  imports: [
    AddSkillsModalComponent,
    CommonModule,
    EditSkillsModalComponent,
    FormsModule,
    AdminNavbarComponent,
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

  constructor(
    private adminService: adminManagementService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.fetchSkills();
  }

  fetchSkills(): void {
    this.adminService.getSkills(this.currentPage, this.itemsPerPage).subscribe(
      ({ skills, totalItems, currentPage, totalPages }) => {
        console.log('Fetched skills:', skills);
        this.skills = skills;
        this.filteredSkills = skills;
        this.totalItems = totalItems;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.filterSkills();
      },
      (error) => {
        console.error('Error fetching skills:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }
  filterSkills(): void {
    this.filteredSkills = this.skills.filter((skill) =>
      skill.name
        ? skill.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        : false
    );
  }

  // private updatePagination(): void {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;
  //   this.filteredSkills = this.skills.slice(start, end);
  // }

  addSkill(skill: Skill): void {
    console.log(skill, 'consoling the skill in add skill');
    this.skills.push(skill);
    this.filterSkills();
    this.cdr.detectChanges();
    this.closeModal();
  }

  handleSkillUpdate(updatedSkill: Skill): void {
    this.fetchSkills();
    const index = this.skills.findIndex(
      (skill) => skill._id === updatedSkill._id
    );
    if (index !== -1) {
      this.skills[index] = updatedSkill;
      this.fetchSkills();
    }
    this.closeEditSkillModal();
    this.cdr.detectChanges(); // Trigger change detection manually
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  openEditSkillModal(skill: Skill): void {
    this.selectedSkill = { ...skill }; // Ensure a fresh copy is passed
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
        this.filterSkills();
      });
    } else {
      console.error('Skill ID is undefined.');
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchSkills();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchSkills();
    }
  }
}
