import { ActionReducerMap } from '@ngrx/store';
import { accountTypeReducer, AccountTypeState } from './account-type.reducer'; // Ensure this path is correct
import { categoryReducer, CategoryState } from './selected-category.reducer';

export interface AppState {
  auth: AccountTypeState;
}

export interface AppState {
  category: CategoryState;
}

export const rootReducer: ActionReducerMap<AppState> = {
  auth: accountTypeReducer,
  category: categoryReducer,
};
