//account-type.action.ts
import { createAction, props } from '@ngrx/store';
import { Category } from '../../admin-management/types/category.model';

export const selectAccountType = createAction(
  '[Account Type] Select Account Type',
  props<{ accountType: string }>()
);

