import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { jobManagementService } from '../../service/job-management.service';
import { StepTwoComponent } from '../step-two/step-two.component';
import { StepThirdComponent } from '../step-three/step-third.component';
import { StepFourComponent } from '../step-four/step-four.component';
import { StepFiveComponent } from '../step-five/step-five.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getJobTitle } from '../../../../../state/selectors/job.selectors';
import { setJobTitle } from '../../../../../state/actions/job.actions';

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    StepTwoComponent,
    StepThirdComponent,
    StepFourComponent,
    StepFiveComponent,
  ],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss',
})
export class StepOneComponent {
  jobTitle: string = '';
  titleError: boolean = false;
  isTitleSelected = false;

  jobTitle$: Observable<string>;

  constructor(private store: Store<{ jobTitle: { jobTitle: string } }>) {
    this.jobTitle$ = this.store.select(getJobTitle);
  }

  onSubmit() {
    if (!this.jobTitle.trim()) {
      this.titleError = true;
      return;
    }
    this.isTitleSelected = true;
    this.store.dispatch(setJobTitle({ jobTitle: this.jobTitle }));
    console.log(this.jobTitle, 'consoling the job title tileFromstore');
  }

  onInputChange() {
    if (this.titleError && this.jobTitle.trim()) {
      this.titleError = false;
    }
  }
}
