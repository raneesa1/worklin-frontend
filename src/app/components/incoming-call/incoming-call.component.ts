import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GlobalIncomingCallService, IncomingCallState } from '../../shared/service/GlobalIncomingCall.service';

@Component({
  selector: 'app-incoming-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incoming-call.component.html',
  styleUrl: './incoming-call.component.scss',
})
export class IncomingCallComponent {
  @Input() callerName: string = '';
  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Input() show: boolean = false;

  private incomingCallState = new BehaviorSubject<IncomingCallState>({
    show: false,
    callerId: '',
    callerName: '',
  });
  getIncomingCallState(): Observable<IncomingCallState> {
    return this.incomingCallState.asObservable();
  }

  setIncomingCallState(state: IncomingCallState): void {
    this.incomingCallState.next(state);
  }

  showIncomingCall(callerId: string, callerName: string): void {
    this.setIncomingCallState({
      show: true,
      callerId,
      callerName,
    });
  }

  hideIncomingCall(): void {
    this.setIncomingCallState({
      show: false,
      callerId: '',
      callerName: '',
    });
  }
}