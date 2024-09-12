import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { jobManagementService } from '../../service/job-management.service';
import { StepFourComponent } from '../step-four/step-four.component';
import { Store } from '@ngrx/store';
import { setSelectedDuration } from '../../../../../state/actions/job.actions';

@Component({
  selector: 'app-step-third',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, StepFourComponent],
  templateUrl: './step-third.component.html',
  styleUrl: './step-third.component.scss',
})
export class StepThirdComponent {
  selectedDuration: string = 'More than 6 months';
  isScopeSelected = false; // Default value
  constructor(private jobService: jobManagementService, private store: Store) {}

  onNextClick() {
    this.isScopeSelected = true;
    this.store.dispatch(
      setSelectedDuration({ duration: this.selectedDuration })
    );
    console.log(this.selectedDuration, 'consoling the selected duration');
  }
}
