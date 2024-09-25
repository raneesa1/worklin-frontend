import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { roleService } from '../../shared/service/role.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss',
})
export class PaymentSuccessComponent implements OnInit {
  amount: number = 0;
  receiver: string = '';
  userRole: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: roleService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.amount = parseFloat(params['amount']);
      this.receiver = params['receiver'];
    });
    this.userRole = this.roleService.getUserRole();
  }

  goBack() {
    this.router.navigate([`${this.userRole}/paymentList`]);
  }
}
