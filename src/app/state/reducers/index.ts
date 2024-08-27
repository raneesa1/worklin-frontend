//index.ts
import { ActionReducerMap } from '@ngrx/store';
import { accountTypeReducer, AccountTypeState } from './account-type.reducer'; // Ensure this path is correct
import { categoryReducer, CategoryState } from './selected-category.reducer';
import { jobReducer, JobState } from './job.reducer';

export interface AppState {
  auth: AccountTypeState;
}

export interface AppState {
  category: CategoryState;
  job: JobState;
}

export const rootReducer: ActionReducerMap<AppState> = {
  auth: accountTypeReducer,
  category: categoryReducer,
  job: jobReducer,
};
