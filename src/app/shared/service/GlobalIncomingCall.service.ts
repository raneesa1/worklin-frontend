import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

export interface IncomingCallState {
  show: boolean;
  callerId: string;
  callerName: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalIncomingCallService {
  private incomingCallSubject = new BehaviorSubject<IncomingCallState | null>(null);
  incomingCall$ = this.incomingCallSubject.asObservable();

  showIncomingCall(callerId: string, callerName: string): void {
    this.incomingCallSubject.next({
      callerId,
      callerName,
      show: true,
    });
  }

  clearIncomingCall(): void {
    this.incomingCallSubject.next(null);
  }

  getCurrentCall(): IncomingCallState | null {
    return this.incomingCallSubject.getValue();
  }
}