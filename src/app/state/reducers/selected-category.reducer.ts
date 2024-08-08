import { createReducer, on, Action } from '@ngrx/store';
import { Category, SubCategory } from '../../admin-management/types/category.model';
import {
  selectCategory,
  clearCategorySelection,
  selectSubcategory,
  clearSubcategorySelection,
} from '../actions/category.actions';

export interface CategoryState {
  selectedCategory: Category | null;
  selectedSubcategories: SubCategory[];
}

export const initialState: CategoryState = {
  selectedCategory: null,
  selectedSubcategories: [],
};

const _categoryReducer = createReducer(
  initialState,
  on(selectCategory, (state, { category }) => ({
    ...state,
    selectedCategory: category,
    selectedSubcategories: [],
  })),
  on(clearCategorySelection, (state) => ({
    ...state,
    selectedCategory: null,
    selectedSubcategories: [],
  })),
  on(selectSubcategory, (state, { subcategory }) => ({
    ...state,
    selectedSubcategories: [...state.selectedSubcategories, subcategory],
  })),
  on(clearSubcategorySelection, (state) => ({
    ...state,
    selectedSubcategories: [],
  }))
);

export function categoryReducer(
  state: CategoryState | undefined,
  action: Action
) {
  return _categoryReducer(state, action);
}
