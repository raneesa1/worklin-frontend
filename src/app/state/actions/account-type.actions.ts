//account-type.action.ts
import { createAction, props } from '@ngrx/store';

export const selectAccountType = createAction(
  '[Account Type] Select Account Type',
  props<{ accountType: string }>()
);

