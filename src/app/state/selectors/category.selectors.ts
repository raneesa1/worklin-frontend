//category.selectors.ts
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { CategoryState } from '../reducers/selected-category.reducer';

export const selectCategoryState = (state: AppState) => state.category;

export const getSelectedCategory = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.selectedCategory
);

export const getSelectedSubcategories = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.selectedSubcategories
);
