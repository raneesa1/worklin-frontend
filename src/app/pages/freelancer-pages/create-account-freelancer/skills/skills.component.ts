import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppState } from '../../../../state/reducers';
import { Store } from '@ngrx/store';
import {
  getSelectedCategory,
  getSelectedSubcategories,
} from '../../../../state/selectors/category.selectors';
import { FormsModule } from '@angular/forms';
import { roleService } from '../../../../shared/service/role.service';
import {
  Category,
  Skill,
  SubCategory,
} from '../../../admin-management/types/category.model';
import { adminManagementService } from '../../../admin-management/service/admin-management.service';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  selectedCategory: Category | null = null;
  selectedSubcategories: SubCategory[] = [];
  skills: Skill[] = [];
  selectedSkills: Skill[] = [];
  errorMessage: string | null = null;

  constructor(
    private store: Store<AppState>,
    private adminService: adminManagementService,
    private router: Router,
    private roleService: roleService,
    private profileService: ProfileManagementService
  ) {}

  ngOnInit(): void {
    this.store.select(getSelectedCategory).subscribe((category) => {
      this.selectedCategory = category;
      if (category && category._id) {
        this.fetchSkillsForCategory(category._id);
      }
    });

    this.store.select(getSelectedSubcategories).subscribe((subcategories) => {
      this.selectedSubcategories = subcategories;
    });
  }

  fetchSkillsForCategory(categoryId: string): void {
    this.adminService
      .getSkillsBtCategoryId(categoryId)
      .subscribe((response: any) => {
        // Extract the skills array from the response
        this.skills = response.skills || [];
        console.log(this.skills, 'Fetched skills');
      });
  }
  onSkillSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const skillId = selectElement.value;
    const skill = this.skills.find((s) => s._id === skillId);
    if (skill && !this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
    }
    this.errorMessage = null;
  }

  removeSelectedSkill(skillId?: string): void {
    this.selectedSkills = this.selectedSkills.filter(
      (skill) => skill._id !== skillId
    );
  }
  submitSkills(): void {
    if (this.selectedSkills.length === 0) {
      this.errorMessage = 'Please select at least one skill before proceeding.';
      return;
    }
    const userId = this.roleService.getUserId();
    const payload = {
      category: this.selectedCategory,
      subcategories: this.selectedSubcategories,
      skills: this.selectedSkills,
      userId,
    };

    console.log(payload, 'consoling the payload');

    if (payload) {
      this.profileService.submitUserSkills(payload).subscribe(
        (response: any) => {
          console.log('Skills submitted successfully', response);
          // Navigate to the next page
          this.router.navigate(['/freelancer/create-account-title']);
        },
        (error: any) => {
          console.error('Error submitting skills', error);
        }
      );
    }
  }
}
