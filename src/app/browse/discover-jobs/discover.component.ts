import { Component, OnInit } from '@angular/core';
import { BrowseService } from '../service/browse.service';
import { IJobPost } from '../../job-management/interfaces/jobPost';
import { CommonModule } from '@angular/common';
import { NavbarAfterLoginComponent } from '../../shared/components/navbar-after-login/navbar-after-login.component';
import { JobListComponent } from '../job-list/job-list.component';
import { SavedJobsComponent } from '../saved-jobs/saved-jobs.component';
import { JobDetailPageComponent } from '../job-detail-page/job-detail-page.component';
import { roleService } from '../../../role.service';
import { Router } from '@angular/router';

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
}
