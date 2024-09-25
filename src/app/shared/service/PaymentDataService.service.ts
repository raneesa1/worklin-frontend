import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPayment } from '../types/IPayment';

@Injectable({
  providedIn: 'root',
})
export class PaymentDataService {
  private paymentDataSubject = new BehaviorSubject<IPayment | null>(
    this.getStoredPaymentData()
  );
  paymentData$ = this.paymentDataSubject.asObservable();

  constructor() {
    // Initialize the BehaviorSubject with stored data on service creation
    this.paymentDataSubject.next(this.getStoredPaymentData());
  }

  setPaymentData(data: IPayment) {
    this.paymentDataSubject.next(data);
    this.storePaymentData(data);
  }

  clearPaymentData() {
    this.paymentDataSubject.next(null);
    localStorage.removeItem('paymentData');
  }

  private storePaymentData(data: IPayment) {
    localStorage.setItem('paymentData', JSON.stringify(data));
  }

  private getStoredPaymentData(): IPayment | null {
    const storedData = localStorage.getItem('paymentData');
    return storedData ? JSON.parse(storedData) : null;
  }
}
