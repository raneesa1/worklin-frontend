import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  GlobalIncomingCallService,
  IncomingCallState,
} from '../../shared/service/GlobalIncomingCall.service';


@Component({
  selector: 'app-incoming-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incoming-call.component.html',
  styles: [
    `
      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .animate-slide-up {
        animation: slideUp 0.3s ease-out forwards;
      }
    `,
  ],
})
export class IncomingCallComponent {
  @Input() callerName: string = '';
  @Output() onAccept = new EventEmitter<void>();
  @Output() onReject = new EventEmitter<void>();
}
