//account-type.reducer.ts
import { createReducer, on, Action } from '@ngrx/store';
import { selectAccountType } from '../actions/account-type.actions';

export interface AccountTypeState {
  accountType: string | null;
}

export const initialState: AccountTypeState = {
  accountType: null,
};

const _accountTypeReducer = createReducer(
  initialState,
  on(selectAccountType, (state, { accountType }) => ({
    ...state,
    accountType,
  }))
);

export function accountTypeReducer(
  state: AccountTypeState | undefined,
  action: Action
) {
  return _accountTypeReducer(state, action);
}
