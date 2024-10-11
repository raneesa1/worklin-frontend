import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type CallStatus = 'idle' | 'calling' | 'incall' | 'receiving';

interface CallData {
  callerId?: string;
  callerName?: string;
  receiverId?: string;
  roomId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideoCallService {
  private callStatusSubject = new BehaviorSubject<CallStatus>('idle');
  callStatus$ = this.callStatusSubject.asObservable();

  private currentCallDataSubject = new BehaviorSubject<CallData>({});
  currentCallData$ = this.currentCallDataSubject.asObservable();

  constructor() {}

  setCallStatus(status: CallStatus) {
    this.callStatusSubject.next(status);
  }

  getCurrentCallStatus(): CallStatus {
    return this.callStatusSubject.getValue();
  }

  setCallData(callData: CallData) {
    this.currentCallDataSubject.next({
      ...this.currentCallDataSubject.getValue(),
      ...callData,
    });
  }

  getCurrentCallData(): CallData {
    return this.currentCallDataSubject.getValue();
  }

  initializeCall(callerId: string, receiverId: string, callerName: string) {
    const roomId = `room_${receiverId}`;
    this.setCallStatus('calling');
    this.setCallData({
      callerId,
      receiverId,
      callerName,
      roomId,
    });
    return roomId;
  }

  handleIncomingCall(callerId: string, callerName: string) {
    this.setCallStatus('receiving');
    this.setCallData({
      callerId,
      callerName,
    });
  }

  acceptCall(accepterId: string) {
    const currentData = this.getCurrentCallData();
    const roomId = `room_${accepterId}`;
    this.setCallStatus('incall');
    this.setCallData({
      ...currentData,
      roomId,
    });
    return roomId;
  }

  endCall() {
    this.setCallStatus('idle');
    this.setCallData({});
  }

  rejectCall() {
    this.setCallStatus('idle');
    this.setCallData({});
  }
}
