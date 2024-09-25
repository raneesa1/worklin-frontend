import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../shared/service/payment.service';
import { IPayment } from '../../../shared/types/IPayment';
import { roleService } from '../../../shared/service/role.service';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { Router } from '@angular/router';
import { PaymentDataService } from '../../../shared/service/PaymentDataService.service';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar.component';

type FilterType = 'all' | 'paid' | 'unpaid' | 'overdue';
type UserRole = 'client' | 'freelancer' | 'admin';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, NavbarAfterLoginComponent,AdminNavbarComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  allTransactions: IPayment[] = [];
  filteredTransactions: IPayment[] = [];
  userId: string = '';
  userRole: UserRole = 'client';
  totalPayable: number = 0;
  totalReceived: number = 0;

  currentFilter: FilterType = 'all';

  constructor(
    private paymentService: PaymentService,
    private roleService: roleService,
    private paymentDataService: PaymentDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.roleService.getUserId();
    this.userRole = this.roleService.getUserRole() as UserRole;
    if (this.userId) {
      this.fetchTransactions();
    }
    console.log(this.userRole, this.userId, 'consoling theuser if and role');
  }

  fetchTransactions(): void {
    this.paymentService.getTransactions(this.userId).subscribe(
      (data) => {
        this.allTransactions = data.payments;
        this.applyFilter(this.currentFilter);
        this.calculateTotals();
        console.log('Transactions:', this.allTransactions);
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  applyFilter(filter: FilterType): void {
    this.currentFilter = filter;
    switch (filter) {
      case 'paid':
        this.filteredTransactions = this.allTransactions.filter(
          (t) => t.status.toLowerCase() === 'paid'
        );
        break;
      case 'unpaid':
        this.filteredTransactions = this.allTransactions.filter((t) =>
          ['issued', 'due'].includes(t.status.toLowerCase())
        );
        break;
      case 'overdue':
        this.filteredTransactions = this.allTransactions.filter(
          (t) => t.status.toLowerCase() === 'overdue'
        );
        break;
      default:
        this.filteredTransactions = this.allTransactions;
    }
    this.calculateTotals();
  }

  getPaymentButtonState(transaction: IPayment): {
    enabled: boolean;
    text: string;
  } {
    const today = new Date();
    const dueDate = new Date(transaction.dueDate);
    const status = transaction.status.toLowerCase();
    const isReceiver = transaction.receiver.receiverId === this.userId;
    const isSender = transaction.sender.senderId === this.userId;

    if (isReceiver) {
      if (status === 'paid') {
        return { enabled: false, text: 'Received' };
      }
      return { enabled: false, text: 'Pending' };
    } else if (isSender) {
      if (status === 'paid') {
        return { enabled: false, text: 'Paid' };
      }
      if (
        status === 'overdue' ||
        status === 'due' ||
        (status === 'issued' && dueDate <= today)
      ) {
        return { enabled: true, text: 'Pay Now' };
      }
      return { enabled: false, text: 'Pay Later' };
    } else {
      // Admin role or other cases
      return { enabled: false, text: status };
    }
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  isFreelancer(): boolean {
    return this.userRole === 'freelancer';
  }

  isClient(): boolean {
    return this.userRole === 'client';
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-500';
      case 'issued':
      case 'due':
        return 'bg-yellow-100 text-yellow-500';
      case 'overdue':
        return 'bg-red-100 text-red-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  }

  isPaymentActionEnabled(transaction: IPayment): boolean {
    return this.getPaymentButtonState(transaction).enabled;
  }

  getReceiverDisplay(transaction: IPayment): string {
    if (transaction.receiver.receiverId === this.userId) {
      return 'You';
    }
    return transaction.receiver.accountType === 'admin'
      ? 'Worklin'
      : transaction.receiver.receiverId;
  }

  getSenderDisplay(transaction: IPayment): string {
    if (transaction.sender.senderId === this.userId) {
      return 'You';
    }
    return transaction.sender.accountType === 'admin'
      ? 'Worklin'
      : transaction.sender.senderId;
  }

  getPaymentButtonText(transaction: IPayment): string {
    return this.getPaymentButtonState(transaction).text;
  }

  isPaymentButtonEnabled(transaction: IPayment): boolean {
    return this.getPaymentButtonState(transaction).enabled;
  }

  handlePayNow(transaction: IPayment) {
    this.paymentDataService.setPaymentData(transaction);
    this.router.navigate([`/checkout`]);
  }
  calculateTotals(): void {
    this.totalPayable = this.allTransactions.reduce((sum, transaction) => {
      if (transaction.sender.senderId === this.userId) {
        return sum + transaction.totalAmount;
      }
      return sum;
    }, 0);

    this.totalReceived = this.allTransactions.reduce((sum, transaction) => {
      if (
        transaction.receiver.receiverId === this.userId &&
        transaction.status.toLowerCase() === 'paid'
      ) {
        return sum + transaction.totalAmount;
      }
      return sum;
    }, 0);
  }
}
