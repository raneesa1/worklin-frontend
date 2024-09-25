import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-fail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-fail.component.html',
  styleUrl: './payment-fail.component.scss',
})
export class PaymentFailComponent implements OnInit{
  amount: number = 0;
  receiver: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.amount = parseFloat(params['amount']);
      this.receiver = params['receiver'];
    });
  }

  goBack() {
    this.router.navigate(['/payments']);
  }
}