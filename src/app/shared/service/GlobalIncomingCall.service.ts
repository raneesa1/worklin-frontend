import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalIncomingCallService {
  private incomingCallSubject = new BehaviorSubject<{
    callerName: string;
    callerId: string;
  } | null>(null);
  incomingCall$: Observable<{ callerName: string; callerId: string } | null> =
    this.incomingCallSubject.asObservable();

  showIncomingCall(callerName: string, callerId: string) {
    console.log('Showing incoming call:', { callerName, callerId });
    this.incomingCallSubject.next({ callerName, callerId });
  }

  clearIncomingCall() {
    console.log('Clearing incoming call');
    this.incomingCallSubject.next(null);
  }
}