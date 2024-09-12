import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { jobManagementService } from '../../service/job-management.service';
import { Store } from '@ngrx/store';
import { BudgetComponent } from '../budget/budget.component';
import { JobState } from '../../../../../state/reducers/job.reducer';
import { setJobDescription } from '../../../../../state/actions/job.actions';

@Component({
  selector: 'app-step-five',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, BudgetComponent],
  templateUrl: './step-five.component.html',
  styleUrl: './step-five.component.scss',
})
export class StepFiveComponent {
  description: string = '';
  errorMessage: string | null = null;
  isDescriptionSelected = false;
  minLength: number = 20; // Set your desired minimum length here

  constructor(
    private router: Router,
    private store: Store<JobState>,
    private jobService: jobManagementService
  ) {}
  onInput() {
    // Clear the error message if the input is valid
    if (this.description.length >= this.minLength) {
      this.errorMessage = null;
    }
  }

  onSubmit() {
    if (!this.description || this.description.length < this.minLength) {
      this.errorMessage = `Description must be at least ${this.minLength} characters long.`;
      return;
    }

    this.errorMessage = null;
    this.isDescriptionSelected = true;
    this.store.dispatch(setJobDescription({ description: this.description }));
    console.log(this.description, 'consoling the description');
  }
}
