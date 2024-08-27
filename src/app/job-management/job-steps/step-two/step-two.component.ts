import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { jobManagementService } from '../../service/job-management.service';
import { Skill } from '../../interfaces/skill';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StepThirdComponent } from '../step-three/step-third.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getSelectedSkills } from '../../../state/selectors/job.selectors';
import { setSelectedSkills } from '../../../state/actions/job.actions';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, StepThirdComponent],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
  
})
export class StepTwoComponent {
  skills: Skill[] = [];
  selectedSkill: Skill | null = null;
  selectedSkills: Skill[] = [];
  error: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 34;
  totalItems: number = 0;
  isSkillSelected = false;
  selectedSkills$: Observable<Skill[]>;

  constructor(
    private jobService: jobManagementService,
    private store: Store<{ skill: { selectedSkills: Skill[] } }>
  ) {
    this.selectedSkills$ = this.store.select(getSelectedSkills);
  }

  ngOnInit() {
    this.getSkills();
  }

  getSkills() {
    this.jobService.getSkills(this.currentPage, this.itemsPerPage).subscribe(
      (response) => {
        this.skills = response.skills;
        this.totalItems = response.totalItems;
      },
      (error) => {
        console.error('Error fetching skills', error);
      }
    );
  }

  addSkill() {
    if (
      this.selectedSkill &&
      !this.selectedSkills.includes(this.selectedSkill)
    ) {
      this.selectedSkills.push(this.selectedSkill);
      this.selectedSkill = null; // Clear the dropdown selection
    }
  }

  removeSkill(skill: Skill) {
    this.selectedSkills = this.selectedSkills.filter((s) => s !== skill);
  }

  onSubmit() {
    if (this.selectedSkills.length === 0) {
      this.error = 'Please select at least one skill before proceeding.';
      return; // Stop further execution if validation fails
    }
    this.isSkillSelected = true;

    this.store.dispatch(setSelectedSkills({ skills: this.selectedSkills }));
    console.log('Selected Skills:', this.selectedSkills);

    this.error = null; 
  }
}
