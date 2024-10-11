// chat-header.component.ts
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { IRoom } from '../../shared/types/IChat';
import { FreelancerEntity } from '../../shared/types/FreelancerEntity';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../shared/service/chat.service';
import { roleService } from '../../shared/service/role.service';
import { SocketService } from '../../shared/service/SocketService';
import { VideoCallService } from '../../shared/service/video-call.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-header.component.html',
})
export class ChatHeaderComponent implements OnInit, OnDestroy {
  @Input() currentRoom!: IRoom;
  @Input() currentReceiver: FreelancerEntity | null = null;
  @Input() currentReceiverId: string = '';

  callStatus: 'idle' | 'calling' | 'incall' | 'receiving' = 'idle';
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private roleService: roleService,
    private socketService: SocketService,
    private videoCallService: VideoCallService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.videoCallService.callStatus$.subscribe((status) => {
        this.callStatus = status;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async initiateVideoCall() {
    if (this.currentReceiverId && this.callStatus === 'idle') {
      try {
        const roomID = `room_${this.currentReceiverId}`;
        const userID = this.roleService.getUserId();
        const userName = 'User_' + this.roleService.getFirstName();

        this.socketService.initiateCall({
          callerId: userID,
          receiverId: this.currentReceiverId,
          callerName: userName,
        });

        this.videoCallService.setCallStatus('calling');

        this.router.navigate(['/video-call'], {
          queryParams: {
            roomID: roomID,
            id: userID,
            receiverId: this.currentReceiverId,
            receiverName: this.currentReceiver?.firstName,
          },
        });
      } catch (err) {
        console.error('Error initiating video call:', err);
        this.videoCallService.setCallStatus('idle');
        alert('Failed to initiate video call. Please try again.');
      }
    }
  }

  endCall() {
    if (this.currentReceiverId) {
      this.socketService.endCall({
        callerId: this.roleService.getUserId(),
        receiverId: this.currentReceiverId,
      });
      this.videoCallService.setCallStatus('idle');
    }
  }

  get isCallActive(): boolean {
    return this.callStatus === 'calling' || this.callStatus === 'incall';
  }
}
