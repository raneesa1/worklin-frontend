import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { selectAccountType } from '../../../state/actions/account-type.actions';
import { AppState } from '../../../state/reducers';


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
