import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { FormsModule } from '@angular/forms';
import { IPayment } from '../../../shared/types/IPayment';
import { Subscription } from 'rxjs';
import { PaymentDataService } from '../../../shared/service/PaymentDataService.service';
import { PaymentService } from '../../../shared/service/payment.service';

@Component({
  selector: 'app-payment-checkout',
  standalone: true,
  imports: [CommonModule, NavbarAfterLoginComponent, FormsModule],
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.scss'],
})
export class PaymentCheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement') cardElementRef!: ElementRef;

  selectedPaymentMethod: string = '';
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  cardErrors: string = '';
  loading: boolean = false;

  private http = inject(HttpClient);
  private paymentService = inject(PaymentService); // Injecting PaymentService

  paymentData: IPayment | null = null;
  private paymentDataSubscription: Subscription | null = null;

  private paymentDataService = inject(PaymentDataService);

  async ngOnInit() {
    this.paymentDataSubscription =
      this.paymentDataService.paymentData$.subscribe((data) => {
        this.paymentData = data;
        if (data) {
          console.log('Received payment data:', data);
        }
      });
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
    if (this.paymentDataSubscription) {
      this.paymentDataSubscription.unsubscribe();
    }
    this.paymentDataService.clearPaymentData();
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }

  async proceedPayment() {
    if (!this.paymentData || !this.paymentData._id) {
      console.error('Payment data is missing');
      return;
    }

    this.loading = true;
    this.cardErrors = '';

    try {
      const response = await this.paymentService
        .getPaymentSession(this.paymentData._id)
        .toPromise();
      console.log(response, 'consoling the response from proceed payment');
      if (response && response.success) {
        console.log('Payment session created:', response);
        await this.redirectToStripeCheckout(response.id);
      } else {
        throw new Error(
          response?.message || 'Failed to create payment session'
        );
      }
    } catch (error: any) {
      console.error('Error creating payment session:', error);
      this.cardErrors =
        error.message || 'An error occurred while processing your payment';
    } finally {
      this.loading = false;
    }
  }

  private async redirectToStripeCheckout(sessionId: string) {
    const stripe = await loadStripe(environment.stripePublishableKey);
    if (stripe) {
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        console.error('Stripe redirect error:', result.error);
        this.cardErrors =
          result.error.message || 'An error occurred during checkout';
      }
    } else {
      console.error('Stripe failed to load');
      this.cardErrors = 'An error occurred during checkout';
    }
  }
}
