import { Component, OnDestroy, OnInit } from '@angular/core';
import { IncomingCallComponent } from '../incoming-call/incoming-call.component';
import { Subscription } from 'rxjs';
import { SocketService } from '../../shared/service/SocketService';
import { GlobalIncomingCallService } from '../../shared/service/GlobalIncomingCall.service';
import { VideoCallService } from '../../shared/service/video-call.service';
import { Router } from '@angular/router';
import { roleService } from '../../shared/service/role.service';

@Component({
  selector: 'app-global-incoming-call',
  standalone: true,
  imports: [IncomingCallComponent],
  templateUrl: './global-incoming-call.component.html',
  styleUrl: './global-incoming-call.component.scss',
})
export class GlobalIncomingCallComponent {
  showIncomingCall: boolean = false;
  callerName: string = '';
  private callerId: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private globalIncomingCallService: GlobalIncomingCallService,
    private socketService: SocketService,
    private videoCallService: VideoCallService,
    private router: Router,
    private roleService: roleService
  ) {}

  // ngOnInit() {
  //   this.subscription.add(
  //     this.globalIncomingCallService.incomingCall$.subscribe(
  //       ({ show, callerName, callerId }) => {
  //         console.log('Received incoming call update:', {
  //           show,
  //           callerName,
  //           callerId,
  //         });
  //         this.showIncomingCall = show;
  //         this.callerName = callerName;
  //         this.callerId = callerId;
  //       }
  //     )
  //   );

  //   this.subscription.add(
  //     this.socketService
  //       .onIncomingCall()
  //       .subscribe(({ callerId, callerName }) => {
  //         console.log('Received incoming call from socket:', {
  //           callerId,
  //           callerName,
  //         });
  //         this.globalIncomingCallService.showIncomingCall(callerName, callerId);
  //       })
  //   );
  // }

  // ngOnDestroy() {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }

  // handleAcceptCall() {
  //   const roomID = `room_${this.roleService.getUserId()}`;
  //   this.socketService.acceptCall({
  //     callerId: this.callerId,
  //     accepterId: this.roleService.getUserId(),
  //     roomID: roomID,
  //   });
  //   this.videoCallService.setCallStatus('incall');
  //   this.router.navigate(['/video-call'], {
  //     queryParams: {
  //       roomID: roomID,
  //       id: this.roleService.getUserId(),
  //       receiverId: this.callerId,
  //     },
  //   });
  //   this.globalIncomingCallService.hideIncomingCall();
  // }

  // handleRejectCall() {
  //   this.socketService.rejectCall({
  //     callerId: this.callerId,
  //     rejecterId: this.roleService.getUserId(),
  //   });
  //   this.videoCallService.setCallStatus('idle');
  //   this.globalIncomingCallService.hideIncomingCall();
  // }
}
