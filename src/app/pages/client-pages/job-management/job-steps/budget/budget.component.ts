import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { jobManagementService } from '../../service/job-management.service';
import { select, Store } from '@ngrx/store';
import { JobState } from '../../../../../state/reducers/job.reducer';
import { roleService } from '../../../../../shared/service/role.service';
import {
  getJobDescription,
  getJobTitle,
  getSelectedDuration,
  getSelectedExperience,
  getSelectedSkills,
} from '../../../../../state/selectors/job.selectors';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent {
  private destroy$ = new Subject<void>();
  selectedRate: string = 'hourly';
  priceFrom: number | null = 15;
  priceTo: number | null = 30;
  isPriceSelected = false;
  globalError: string = '';
  isFormValid = true;

  // Selectors
  selectedDuration$: Observable<string>;
  selectedExperience$: Observable<string>;
  jobTitle$: Observable<string>;
  selectedSkills$: Observable<any[]>;
  jobDescription$: Observable<string>;

  constructor(
    private router: Router,
    private jobService: jobManagementService,
    private store: Store<JobState>,
    private roleService: roleService
  ) {
    this.selectedDuration$ = this.store.pipe(select(getSelectedDuration));
    this.selectedExperience$ = this.store.pipe(select(getSelectedExperience));
    this.jobTitle$ = this.store.pipe(select(getJobTitle));
    this.selectedSkills$ = this.store.pipe(select(getSelectedSkills));
    this.jobDescription$ = this.store.pipe(select(getJobDescription));
  }

  onRateSelection(rate: string) {
    this.selectedRate = rate;
    this.validateBudget(); // Re-validate when the rate type changes
  }

  validateBudget() {
    this.globalError = '';
    this.isFormValid = true;

    if (this.priceFrom === null || this.priceTo === null) {
      this.globalError = 'Please fill in both budget fields.';
      this.isFormValid = false;
      return;
    }

    if (isNaN(this.priceFrom) || isNaN(this.priceTo)) {
      this.globalError = 'Budget values must be numbers.';
      this.isFormValid = false;
      return;
    }

    if (this.priceFrom > this.priceTo) {
      this.globalError =
        'The "From" amount cannot be greater than the "To" amount.';
      this.isFormValid = false;
      return;
    }

    if (this.priceFrom > 10000 || this.priceTo > 10000) {
      this.globalError =
        'Please provide a realistic budget within reasonable limits.';
      this.isFormValid = false;
    }
  }

  onSubmit() {
    if (this.isFormValid) {
      const userId = this.roleService.getUserId();
      if (!userId) {
        return console.log('userId is required');
      }
      this.selectedDuration$
        .pipe(takeUntil(this.destroy$))
        .subscribe((duration) => {
          this.selectedExperience$
            .pipe(takeUntil(this.destroy$))
            .subscribe((experience) => {
              this.jobTitle$
                .pipe(takeUntil(this.destroy$))
                .subscribe((title) => {
                  this.selectedSkills$
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((skills) => {
                      this.jobDescription$
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((description) => {
                          const jobPost = {
                            clientId: userId,
                            title: title,
                            description: description,
                            duration: duration,
                            experience: experience,
                            skills: skills,
                            priceFrom: this.priceFrom || 0,
                            priceTo: this.priceTo ?? undefined,
                            rate: this.selectedRate,
                          };

                          this.jobService
                            .submitJobPost(jobPost)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(
                              (response) => {
                                console.log(
                                  'Job post submitted successfully',
                                  response
                                );
                                localStorage.setItem(
                                  'jobPost',
                                  JSON.stringify(response.jobPost)
                                );
                                this.router.navigate(['/client/reviewPost']);
                              },
                              (error) => {
                                this.globalError =
                                  'An error occurred while submitting the job post.';
                                console.error('Error:', error);
                              }
                            );
                          console.log(
                            jobPost,
                            'consoling the job post details before sending to backend'
                          );
                        });
                    });
                });
            });
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
