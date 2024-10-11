import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../shared/service/SocketService';
import { VideoCallService } from '../../shared/service/video-call.service';
import { roleService } from '../../shared/service/role.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-call-handler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-call-handler.component.html',
  styleUrl: './video-call-handler.component.scss',
})
export class VideoCallHandlerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  showIncomingCall = false;
  incomingCallerName = '';
  incomingCallerId = '';
  callStatus: 'idle' | 'calling' | 'incall' | 'receiving' = 'idle';
  currentReceiverName = '';
  currentReceiverId = '';

  constructor(
    private socketService: SocketService,
    private videoCallService: VideoCallService,
    private roleService: roleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.videoCallService.callStatus$.subscribe((status) => {
        this.callStatus = status;
      }),

      this.socketService
        .onIncomingCall()
        .subscribe(({ callerId, callerName }) => {
          this.showIncomingCall = true;
          this.incomingCallerId = callerId;
          this.incomingCallerName = callerName;
          this.videoCallService.setCallStatus('receiving');
        })
    );
  }

  handleAcceptCall() {
    const roomID = `room_${this.roleService.getUserId()}`;
    const userId = this.roleService.getUserId();

    this.socketService.acceptCall({
      callerId: this.incomingCallerId,
      accepterId: userId,
      roomID: roomID,
    });

    this.router.navigate(['/video-call'], {
      queryParams: {
        roomID: roomID,
        id: userId,
        receiverId: this.incomingCallerId,
      },
    });

    this.showIncomingCall = false;
    this.videoCallService.setCallStatus('incall');
  }

  handleRejectCall() {
    const userId = this.roleService.getUserId();

    this.socketService.rejectCall({
      callerId: this.incomingCallerId,
      rejecterId: userId,
    });

    this.showIncomingCall = false;
    this.videoCallService.setCallStatus('idle');
  }

  endCall() {
    if (this.currentReceiverId) {
      this.socketService.endCall({
        callerId: this.roleService.getUserId(),
        receiverId: this.currentReceiverId,
      });
    }
    this.videoCallService.setCallStatus('idle');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}