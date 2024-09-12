import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { SavedJobsComponent } from '../saved-jobs/saved-jobs.component';
import { JobDetailPageComponent } from '../job-detail-page/job-detail-page.component';
import { roleService } from '../../../shared/service/role.service';
import { Router } from '@angular/router';
import { JobListComponent } from '../job-list/job-list.component';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    CommonModule,
    NavbarAfterLoginComponent,
    JobListComponent,
    SavedJobsComponent,
    JobDetailPageComponent,
  ],
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'], // Fix the typo here
})
export class DiscoverComponent {
  selectedTab: string = 'bestMatches'; // Default tab
  isSuccessModalVisible: boolean = false;

  constructor(private roleService: roleService, private router: Router) {}

  onLogout() {
    this.roleService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  showBestMatches() {
    this.selectedTab = 'bestMatches';
  }

  showMostRecent() {
    this.selectedTab = 'mostRecent';
  }

  showSavedJobs() {
    this.selectedTab = 'savedJobs';
  }
  showSuccessModal() {
    this.isSuccessModalVisible = true;
  }

  closeSuccessModal() {
    this.isSuccessModalVisible = false;
  }
}
