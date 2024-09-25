import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoCallService {
  private callStatusSubject = new BehaviorSubject<
    'idle' | 'calling' | 'incall' | 'receiving'
  >('idle');
  callStatus$ = this.callStatusSubject.asObservable();

  setCallStatus(status: 'idle' | 'calling' | 'incall' | 'receiving') {
    this.callStatusSubject.next(status);
  }

  endCall() {
    this.callStatusSubject.next('idle');
  }
}
