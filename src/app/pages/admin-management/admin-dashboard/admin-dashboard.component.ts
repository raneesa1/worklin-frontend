import { Component, OnInit } from '@angular/core';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar.component';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminNavbarComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadProfileViewsChart();
  }

  loadProfileViewsChart(): void {
    new Chart('profileViewsChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Profile Views',
            data: [100, 150, 130, 200, 250, 180],
            borderColor: 'rgb(0, 128, 128)',
            backgroundColor: '#AFE0DA',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}
