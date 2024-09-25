import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { RouterOutlet } from '@angular/router';
import { mergeMapTo } from 'rxjs';

@Component({
  selector: 'app-firebase-notification',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './firebase-notification.component.html',
  styleUrl: './firebase-notification.component.scss',
})
export class FirebaseNotificationComponent implements OnInit {
  private afMessaging = inject(AngularFireMessaging);
  notificationMessage: string = '';

  ngOnInit() {
    this.requestPermission();
    this.listenForMessages();
  }

  requestPermission() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          this.notificationMessage =
            'Notification permission granted. Token received.';
          // TODO: Send this token to your server
        },
        (error) => {
          console.error('Unable to get permission', error);
          this.notificationMessage =
            'Unable to get permission for notifications.';
        }
      );
  }

  listenForMessages() {
    this.afMessaging.messages.subscribe((message) => {
      console.log('New message received:', message);
      this.notificationMessage = `New notification: ${message['notification']?.body}`;
    });
  }
}