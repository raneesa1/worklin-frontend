// category.actions.ts
import { createAction, props } from '@ngrx/store';
import { Category, SubCategory } from '../../pages/admin-management/types/category.model';

export const selectCategory = createAction(
  '[Category] Select Category',
  props<{ category: Category }>()
);
export const clearCategorySelection = createAction(
  '[Category] Clear Category Selection'
);


export const selectSubcategory = createAction(
  '[Category] Select Subcategory',
  props<{ subcategory: SubCategory}>()
);

export const clearSubcategorySelection = createAction(
  '[Category] Clear Subcategory Selection'
);
