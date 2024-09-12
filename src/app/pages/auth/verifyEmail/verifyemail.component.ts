import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-verifyemail',
  standalone: true,
  imports: [FooterComponent, CommonModule, FormsModule],
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss'],
})
export class VerifyemailComponent {
  @Output()
  otpSubmitted: EventEmitter<string[]> = new EventEmitter<string[]>();
  resendCodeTimer: number = 30;
  canResendCode: boolean = false;
  @Input() email!: string;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();
  private timerInterval: any;
  @HostListener('keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.handleBackspace(event);
    }
  }

  ngOnInit(): void {
    this.startResendCodeTimer();
  }

  constructor(private authService: AuthService) {}
  moveToNext(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    this.otp[index - 1] = input.value;

    if (input.value.length === 1 && index < 6) {
      const nextInput = document.querySelectorAll('.otp-input')[
        index
      ] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
  handleBackspace(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLInputElement;
    const index = Array.from(document.querySelectorAll('.otp-input')).indexOf(
      activeElement
    );

    if (index > 0 && activeElement.value.length === 0) {
      // Update otp array when moving focus to the previous input
      this.otp[index] = ''; // Clear current input value
      const prevInput = document.querySelectorAll('.otp-input')[
        index - 1
      ] as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  otp: string[] = ['', '', '', '', '', ''];

  onSubmit(e: Event) {
    e.preventDefault();
    console.log('OTP Submitted:', this.otp);
    this.otpSubmitted.emit(this.otp); // Emit the OTP data
  }

  resendCode() {
    if (this.canResendCode) {
      this.canResendCode = false;
      this.resendCodeTimer = 30;
      this.startResendCodeTimer();
      this.authService
        .resendOtp(this.email)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            console.log('OTP resent successfully', response);
          },
          (error) => {
            console.error('Error resending OTP', error);
          }
        );
    }
  }
  startResendCodeTimer() {
    this.canResendCode = false;
    const timerInterval = setInterval(() => {
      this.resendCodeTimer -= 1;
      if (this.resendCodeTimer === 0) {
        this.canResendCode = true;
        clearInterval(timerInterval);
      }
    }, 1000);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
