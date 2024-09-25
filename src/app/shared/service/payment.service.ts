import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:8000/payment'; // Adjust to your API base URL

  constructor(private http: HttpClient) {}

  getTransactions(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getTransaction/${userId}`);
  }

  getPaymentSession(paymentId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/createPaymentSession`, {
      paymentId,
    });
  }
}
