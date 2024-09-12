import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { jobManagementService } from '../../service/job-management.service';
import { StepFiveComponent } from '../step-five/step-five.component';
import { Store } from '@ngrx/store';
import { setSelectedExperience } from '../../../../../state/actions/job.actions';
import { JobState } from '../../../../../state/reducers/job.reducer';

@Component({
  selector: 'app-step-four',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, StepFiveComponent],
  templateUrl: './step-four.component.html',
  styleUrl: './step-four.component.scss',
})
export class StepFourComponent {
  selectedExperience: string = 'Entry'; // Default value
  isExperienceSelected = false;
  constructor(
    private jobService: jobManagementService,
    private store: Store<JobState>
  ) {}

  onSubmit() {
    this.isExperienceSelected = true;
    this.store.dispatch(
      setSelectedExperience({ experience: this.selectedExperience })
    );
    console.log(this.selectedExperience, 'consoling the selected experience');
  }
}
