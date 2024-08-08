import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { selectAccountType } from '../../state/actions/account-type.actions';
import { Store, StoreModule } from '@ngrx/store';

import { AppState } from '../../state/app.state'; // Adjust import path

@Component({
  selector: 'app-account-type',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './account-type.component.html',
  styleUrl: './account-type.component.scss',
})
export class AccountTypeComponent {
  @Output() accountTypeSelected = new EventEmitter<string>();

  constructor(private store: Store<AppState>) {}

  selectType(type: string): void {
    this.store.dispatch(selectAccountType({ accountType: type }));
    console.log(type, 'consoling the type from account type component');
    this.accountTypeSelected.emit(type);
  }
}
