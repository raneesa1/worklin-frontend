import { Component, OnInit } from '@angular/core';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar.component';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ViewMoreListComponent } from '../../../components/view-more-list/view-more-list.component';
import { BrowseService } from '../../../shared/service/browse.service';
import { adminManagementService } from '../service/admin-management.service';
import { Observable } from 'rxjs';

// Define the interface for the hiring data response
interface HiringData {
  month: string;
  hires: number;
}

interface AdminDashboardData {
  hiringData: HiringData[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    AdminNavbarComponent,
    CommonModule,
    FormsModule,
    ViewMoreListComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private hiringChart: Chart | undefined;
  selectedTimeRange: string = 'last6Months';
  timeRanges = [
    { value: 'pastMonth', label: 'Past 1 Month' },
    { value: 'last6Months', label: 'Last 6 Months' },
    { value: 'pastYear', label: 'Past 1 Year' },
    { value: 'allTime', label: 'All Time' },
  ];
  numberOfUsers: number = 0;
  numberOfJobPost: number = 0;
  totalHires: number = 0;

  constructor(
    private http: HttpClient,
    private userService: BrowseService,
    private adminService: adminManagementService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadHiringData();
    this.loadTotalUsers();
    this.loadTotalJobPosts();
  }

  loadHiringData(): void {
    // Use the adminService to get hiring data dynamically
    this.adminService.getAdminDashboardData(this.selectedTimeRange).subscribe(
      (response: AdminDashboardData) => {
        this.updateHiringChart(response.hiringData);
        this.calculateTotalHires(response.hiringData);
      },
      (error) => {
        console.error('Error fetching hiring data:', error);
        // Fallback to dummy data if the API call fails
        this.updateHiringChart(this.getDummyData(this.selectedTimeRange));
      }
    );
  }

  calculateTotalHires(hiringData: { month: string; hires: number }[]): void {
    this.totalHires = hiringData.reduce((total, item) => total + item.hires, 0); // Calculate the total hires
  }
  loadTotalJobPosts(): void {
    this.adminService.getTotalJobPost().subscribe(
      (response) => {
        console.log(response, 'consoling the total job post');
        this.numberOfJobPost = response.NumberOfJobPosts;
      },
      (error) => {
        console.error('Error fetching total job posts:', error);
      }
    );
  }

  loadTotalUsers(): void {
    this.adminService.getAllClients().subscribe(
      (clients) => {
        console.log(clients.length, 'ejnfgoengoegnoer');
        this.userService.getFreelancers().subscribe((freelancers) => {
          this.numberOfUsers = clients.length + freelancers.length;
        });
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  updateHiringChart(data: HiringData[]): void {
    const ctx = document.getElementById('hiringChart') as HTMLCanvasElement;

    if (this.hiringChart) {
      this.hiringChart.destroy();
    }

    this.hiringChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((item) => item.month),
        datasets: [
          {
            label: 'Hires',
            data: data.map((item) => item.hires),
            borderColor: 'rgb(0, 128, 128)',
            backgroundColor: '#AFE0DA',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Hires',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Monthly Hiring Data',
          },
          legend: {
            display: false,
          },
        },
      },
    });
  }

  getDummyData(range: string): HiringData[] {
    const baseData = [
      { month: 'Jan', hires: 20 },
      { month: 'Feb', hires: 25 },
      { month: 'Mar', hires: 30 },
      { month: 'Apr', hires: 28 },
      { month: 'May', hires: 35 },
      { month: 'Jun', hires: 40 },
    ];

    switch (range) {
      case 'pastMonth':
        return baseData.slice(-1);
      case 'last6Months':
        return baseData;
      case 'pastYear':
        return [...baseData, ...baseData].slice(0, 12);
      case 'allTime':
        return [...baseData, ...baseData, ...baseData, ...baseData].slice(
          0,
          24
        );
      default:
        return baseData;
    }
  }

  onTimeRangeChange(): void {
    this.loadHiringData();
  }
}
