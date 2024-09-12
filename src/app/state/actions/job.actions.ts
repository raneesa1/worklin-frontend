// src/app/state/actions/job.actions.ts
import { createAction, props } from '@ngrx/store';
import { Skill } from '../../pages/admin-management/types/category.model';

export const setSelectedDuration = createAction(
  '[Job] Set Selected Duration',
  props<{ duration: string }>()
);

export const setSelectedExperience = createAction(
  '[Job] Set Selected Experience',
  props<{ experience: string }>()
);

export const setJobTitle = createAction(
  '[Job] Set Job Title',
  props<{ jobTitle: string }>()
);

export const clearJobTitle = createAction('[Job] Clear Job Title');

export const setSelectedSkills = createAction(
  '[Skills] Set Selected Skills',
  props<{ skills: Skill[] }>()
);

export const clearSelectedSkills = createAction(
  '[Skills] Clear Selected Skills'
);

export const setJobDescription = createAction(
  '[Job] Set Job Description',
  props<{ description: string }>()
);
