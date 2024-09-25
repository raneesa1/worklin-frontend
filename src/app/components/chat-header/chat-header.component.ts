import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IRoom } from '../../shared/types/IChat';
import { FreelancerEntity } from '../../shared/types/FreelancerEntity';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../shared/service/chat.service';
import { roleService } from '../../shared/service/role.service';
import { SocketService } from '../../shared/service/SocketService';
import { VideoCallService } from '../../shared/service/video-call.service';
import { Router } from '@angular/router';
import { IncomingCallComponent } from '../incoming-call/incoming-call.component';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule, IncomingCallComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent implements OnInit, OnDestroy {
  @Input() currentRoom!: IRoom;
  @Input() currentReceiver: FreelancerEntity | null = null;
  @Input() currentReceiverId: string = '';

  showIncomingCall: boolean = false;
  incomingCallerId: string = '';
  incomingCallerName: string = '';

  callStatus: 'idle' | 'calling' | 'incall' | 'receiving' = 'idle';
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private roleService: roleService,
    private socketService: SocketService,
    private videoCallService: VideoCallService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.videoCallService.callStatus$.subscribe(
        (status) => (this.callStatus = status)
      ),
      this.socketService
        .onIncomingCall()
        .subscribe(({ callerId, callerName }) => {
          this.handleIncomingCall(callerId, callerName);
        }),
      this.socketService
        .onCallAccepted()
        .subscribe(({ accepterId, roomID }) => {
          this.handleCallAccepted(accepterId, roomID);
        }),
      this.socketService.onCallRejected().subscribe(({ rejecterId }) => {
        this.handleCallRejected(rejecterId);
      }),
      this.socketService.onCallEnded().subscribe(({ callerId }) => {
        this.handleCallEnded(callerId);
      })
    );
    this.subscriptions.push(
      this.socketService
        .onIncomingCall()
        .subscribe(({ callerId, callerName }) => {
          this.showIncomingCall = true;
          this.incomingCallerId = callerId;
          this.incomingCallerName = callerName;
        })
    );
  }
   handleAcceptCall() {
    this.acceptIncomingCall();
    this.showIncomingCall = false;
  }

  handleRejectCall() {
    this.rejectIncomingCall();
    this.showIncomingCall = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async initiateVideoCall() {
    if (this.currentReceiverId) {
      try {
        const roomID = `room_${this.currentReceiverId}`;
        const userID = this.roleService.getUserId();
        const userName = 'User_' + userID;

        this.socketService.initiateCall({
          callerId: userID,
          receiverId: this.currentReceiverId,
          callerName: userName,
        });

        this.videoCallService.setCallStatus('calling');

        // Navigate to video call component
        this.router.navigate(['/video-call'], {
          queryParams: {
            roomID: roomID,
            id: userID,
            receiverId: this.currentReceiverId,
          },
        });
      } catch (err) {
        console.error('Error initiating video call:', err);
        alert('Failed to initiate video call. Please try again.');
      }
    } else {
      console.error('No current receiver or receiver ID');
      alert('Cannot initiate call: No receiver selected.');
    }
  }

  private handleIncomingCall(callerId: string, callerName: string) {
    this.videoCallService.setCallStatus('receiving');
    // Show UI for incoming call (implement this in your template)
  }

  private handleCallAccepted(accepterId: string, roomID: string) {
    if (
      this.callStatus === 'calling' &&
      accepterId === this.currentReceiverId
    ) {
      this.videoCallService.setCallStatus('incall');
      // Navigate to video call component
      this.router.navigate(['/video-call'], {
        queryParams: {
          roomID: roomID,
          id: this.roleService.getUserId(),
          receiverId: accepterId,
        },
      });
    }
  }

  private handleCallRejected(rejecterId: string) {
    if (
      this.callStatus === 'calling' &&
      rejecterId === this.currentReceiverId
    ) {
      this.videoCallService.setCallStatus('idle');
      alert('Call was rejected');
    }
  }

  private handleCallEnded(callerId: string) {
    if (this.callStatus === 'incall') {
      this.videoCallService.setCallStatus('idle');
      // Handle call end UI updates
    }
  }

  acceptIncomingCall() {
    const roomID = `room_${this.roleService.getUserId()}`;
    this.socketService.acceptCall({
      callerId: this.currentReceiverId,
      accepterId: this.roleService.getUserId(),
      roomID: roomID,
    });
    this.videoCallService.setCallStatus('incall');
    // Navigate to video call component
    this.router.navigate(['/video-call'], {
      queryParams: {
        roomID: roomID,
        id: this.roleService.getUserId(),
        receiverId: this.currentReceiverId,
      },
    });
  }

  rejectIncomingCall() {
    this.socketService.rejectCall({
      callerId: this.currentReceiverId,
      rejecterId: this.roleService.getUserId(),
    });
    this.videoCallService.setCallStatus('idle');
  }

  endCall() {
    if (this.currentReceiverId) {
      this.socketService.endCall({
        callerId: this.roleService.getUserId(),
        receiverId: this.currentReceiverId,
      });
      this.videoCallService.endCall();
    }
  }

  get isCallActive(): boolean {
    return this.callStatus === 'calling' || this.callStatus === 'incall';
  }
}
