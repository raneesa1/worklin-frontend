import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';

@Component({
  selector: 'app-my-proposals',
  standalone: true,
  imports: [CommonModule, NavbarAfterLoginComponent],
  templateUrl: './my-proposals.component.html',
  styleUrl: './my-proposals.component.scss',
})
export class MyProposalsComponent {}
