// src/app/state/reducers/job.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {
  clearJobTitle,
  clearSelectedSkills,
  setJobTitle,
  setSelectedDuration,
  setSelectedExperience,
  setSelectedSkills,
  setJobDescription,
} from '../actions/job.actions';
import { Skill } from '../../pages/admin-management/types/category.model';

export interface JobState {
  selectedDuration: string;
  selectedExperience: string;
  jobTitle: string;
  selectedSkills: Skill[];
  jobDescription: string;
}

export const initialState: JobState = {
  selectedDuration: '',
  selectedExperience: '',
  jobTitle: '',
  selectedSkills: [],
  jobDescription: '',
};

export const jobReducer = createReducer(
  initialState,
  on(setSelectedDuration, (state, { duration }) => ({
    ...state,
    selectedDuration: duration,
  })),
  on(setSelectedExperience, (state, { experience }) => ({
    ...state,
    selectedExperience: experience,
  })),
  on(setJobTitle, (state, { jobTitle }) => ({
    ...state,
    jobTitle,
  })),
  on(setSelectedSkills, (state, { skills }) => ({
    ...state,
    selectedSkills: skills,
  })),
  on(setJobDescription, (state, { description }) => ({
    ...state,
    jobDescription: description,
  }))
);
