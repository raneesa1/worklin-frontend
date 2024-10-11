import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { SocketService } from '../../shared/service/SocketService';
import { VideoCallService } from '../../shared/service/video-call.service';
import { Subscription } from 'rxjs';
import { roleService } from '../../shared/service/role.service';

@Component({
  selector: 'app-video-call',
  template: '<div #meetingContainer></div>',
  styles: [':host { width: 100%; height: 100%; }'],
})
export class VideoCallComponentComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('meetingContainer') meetingContainer!: ElementRef;

  private roomID: string = '';
  private userID: string = '';
  private userName: string = '';
  private receiverId: string = '';
  private receiverName: string = '';
  private zp: ZegoUIKitPrebuilt | null = null;
  private subscriptions: Subscription[] = [];
  private userRole: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService,
    private videoCallService: VideoCallService,
    private authService: roleService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.roomID = params['roomID'] || '';
      this.userID = params['id'] || '';
      this.receiverName = params['receiverName'] || '';
      this.receiverId = params['receiverId'] || '';
      this.userName = `User_${this.receiverName}`;

      console.log('Received query params:', {
        roomID: this.roomID,
        userID: this.userID,
        userName: this.userName,
        receiverId: this.receiverId,
      });
    });
    this.userRole = this.authService.getUserRole();

    // Subscribe to user joined events
    this.subscriptions.push(
      this.socketService.onUserJoined().subscribe(({ userId }) => {
        console.log(`User ${userId} joined the room`);
        // No need to manually add participants, ZegoUIKitPrebuilt handles this automatically
      })
    );
    this.videoCallService.setCallStatus('incall');
  }

  ngAfterViewInit() {
    if (this.roomID && this.userID) {
      this.initializeVideoCall();
    } else {
      console.error('Missing required parameters for video call');
      alert('Failed to initialize video call. Missing required parameters.');
      this.router.navigate(['/freelancer/message']);
    }
  }

  ngOnDestroy() {
    if (this.zp) {
      this.zp.destroy();
    }
    this.socketService.leaveVideoRoom({
      roomID: this.roomID,
      userId: this.userID,
    });
    this.videoCallService.setCallStatus('idle');

    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private async initializeVideoCall() {
    try {
      const appID = 863734687;
      const serverSecret = '6510b1295c2524a233bfb8e09c6f6f2c';

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        this.roomID,
        this.userID,
        this.userName
      );

      this.zp = ZegoUIKitPrebuilt.create(kitToken);

      this.zp.joinRoom({
        container: this.meetingContainer.nativeElement,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // Use GroupCall mode to support multiple participants
        },
        showPreJoinView: false,
        onJoinRoom: () => {
          console.log('Joined room successfully');
          this.socketService.joinVideoRoom({
            roomID: this.roomID,
            userId: this.userID,
          });
        },
        onLeaveRoom: () => {
          console.log('Left room');
          this.socketService.leaveVideoRoom({
            roomID: this.roomID,
            userId: this.userID,
          });
          this.redirectToMessagePage();
        },
      });

      this.videoCallService.setCallStatus('incall');
    } catch (error) {
      console.error('Error joining video call:', error);
      alert('Failed to join the video call. Please try again.');
      this.redirectToMessagePage();
    }
  }
  private redirectToMessagePage() {
    this.router.navigate([`/${this.userRole}/messages`]);
  }
}
