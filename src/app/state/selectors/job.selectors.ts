// src/app/state/selectors/job.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { JobState } from '../reducers/job.reducer';

export const selectJobState = createFeatureSelector<JobState>('job');

export const getSelectedDuration = createSelector(
  selectJobState,
  (state: JobState) => state.selectedDuration
);

export const getSelectedExperience = createSelector(
  selectJobState,
  (state: JobState) => state.selectedExperience
);

export const getJobTitle = createSelector(
  selectJobState,
  (state: JobState) => state.jobTitle
);

export const getSelectedSkills = createSelector(
  selectJobState,
  (state: JobState) => state.selectedSkills
);

export const getJobDescription = createSelector(
  selectJobState,
  (state: JobState) => state.jobDescription
);
