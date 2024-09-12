import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IRoom } from '../../shared/types/IChat';
import { FreelancerEntity } from '../../shared/types/FreelancerEntity';
import { CommonModule } from '@angular/common';
import { VoiceCallService } from '../../shared/service/voiceCallService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent implements OnInit, OnDestroy {
  @Input() currentRoom!: IRoom;
  @Input() currentReceiver: FreelancerEntity | null = null;

  callStatus: 'idle' | 'calling' | 'incall' = 'idle';
  private callStatusSubscription: Subscription | null = null;

  constructor(private voiceCallService: VoiceCallService) {}

  ngOnInit() {
    this.callStatusSubscription = this.voiceCallService.callStatus.subscribe(
      (status) => (this.callStatus = status)
    );
  }

  ngOnDestroy() {
    if (this.callStatusSubscription) {
      this.callStatusSubscription.unsubscribe();
    }
  }

  onVideoCall() {
    // Implement video call functionality
    console.log('Video call initiated');
  }
  // onVoiceCall() {
  //   if (this.currentReceiver?._id && this.currentRoom?._id) {
  //     this.voiceCallService.startCall(
  //       this.currentReceiver._id,
  //       this.currentRoom._id
  //     );
  //   } else {
  //     console.error('No receiver or room selected for voice call');
  //   }
  // }
  // get isCallActive(): boolean {
  //   return this.callStatus === 'calling' || this.callStatus === 'incall';
  // }

  answerCall() {
    this.voiceCallService.answerCall();
  }

  endCall() {
    this.voiceCallService.endCall();
  }
 
}
