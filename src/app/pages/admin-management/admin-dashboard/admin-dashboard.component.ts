import { Component, OnInit } from '@angular/core';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar.component';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ViewMoreListComponent } from '../../../components/view-more-list/view-more-list.component';

interface HiringData {
  month: string;
  hires: number;
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

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadHiringData();
  }

  loadHiringData(): void {
    this.http
      .get<HiringData[]>(`/api/hiring-data?range=${this.selectedTimeRange}`)
      .subscribe(
        (data) => {
          this.updateHiringChart(data);
        },
        (error) => {
          console.error('Error fetching hiring data:', error);
          // Fallback to dummy data if the API call fails
          this.updateHiringChart(this.getDummyData(this.selectedTimeRange));
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
