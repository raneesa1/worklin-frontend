import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-posted-notification',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './job-posted-notification.component.html',
  styleUrl: './job-posted-notification.component.scss',
})
export class JobPostedNotificationComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/client/discover']);
    }, 2000); // 10 seconds = 10000 milliseconds
  }
}