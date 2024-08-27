//account-type.selectors
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers'; // Adjust the path according to your project structure

// Define the selector for accountType
export const selectAccountType = createSelector(
  (state: AppState) => state.auth.accountType,
  (accountType) => accountType
);
