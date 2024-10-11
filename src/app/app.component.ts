import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseNotificationComponent } from './components/firebase-notification/firebase-notification.component';
import { IncomingCallComponent } from './components/incoming-call/incoming-call.component';
import { GlobalIncomingCallComponent } from './components/global-incoming-call/global-incoming-call.component';
import { Observable, Subscription } from 'rxjs';
import { GlobalIncomingCallService, IncomingCallState } from './shared/service/GlobalIncomingCall.service';
import { CommonModule } from '@angular/common';
import { VideoCallHandlerComponent } from './components/video-call-handler/video-call-handler.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FirebaseNotificationComponent,
    GlobalIncomingCallComponent,
    IncomingCallComponent,
    CommonModule,
    VideoCallHandlerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'worklin-frontend';
 }