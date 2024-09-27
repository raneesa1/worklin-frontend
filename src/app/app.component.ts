import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseNotificationComponent } from './components/firebase-notification/firebase-notification.component';
import { IncomingCallComponent } from './components/incoming-call/incoming-call.component';
import { GlobalIncomingCallComponent } from './components/global-incoming-call/global-incoming-call.component';
import { Observable } from 'rxjs';
import { GlobalIncomingCallService } from './shared/service/GlobalIncomingCall.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FirebaseNotificationComponent,
    GlobalIncomingCallComponent,
    IncomingCallComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'worklin-frontend';
  showIncomingCall = false;
  callerName = '';
  callerId = '';

  @ViewChild(IncomingCallComponent)
  incomingCall!: IncomingCallComponent;

  constructor(private globalIncomingCallService: GlobalIncomingCallService) {}
  ngOnInit() {
    this.globalIncomingCallService.incomingCall$.subscribe((call) => {
      console.log('AppComponent received incoming call:', call);
      if (call) {
        this.showIncomingCall = true;
        this.callerName = call.callerName;
        this.callerId = call.callerId;
      } else {
        this.showIncomingCall = false;
      }
    });
  }
  handleAcceptCall() {
    this.incomingCall.acceptCall();
    this.globalIncomingCallService.clearIncomingCall();
  }

  handleRejectCall() {
    this.incomingCall.rejectCall();
    this.globalIncomingCallService.clearIncomingCall();
  }
}
