import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseNotificationComponent } from './components/firebase-notification/firebase-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FirebaseNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent  {
  title = 'worklin-frontend';
}
