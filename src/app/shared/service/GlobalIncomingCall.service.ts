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