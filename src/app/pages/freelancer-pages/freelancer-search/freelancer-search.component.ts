import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { JobDetailPageComponent } from '../job-detail-page/job-detail-page.component';
import { IJobPost } from '../../client-pages/job-management/interfaces/jobPost';
import { JobListComponent } from '../job-list/job-list.component';
import { FormsModule } from '@angular/forms';
import { SharedSearchService } from '../../../shared/service/sharedSearch.service';

@Component({
  selector: 'app-freelancer-search',
  standalone: true,
  imports: [
    CommonModule,
    NavbarAfterLoginComponent,
    JobListComponent,
    FormsModule,
  ],
  templateUrl: './freelancer-search.component.html',
  styleUrl: './freelancer-search.component.scss',
})
export class FreelancerSearchComponent {
  searchQuery: string = '';
  searchType: string = '';

  constructor(private sharedSearchService: SharedSearchService) {}

  ngOnInit() {
    this.sharedSearchService.searchQuery$.subscribe((query) => {
      this.searchQuery = query;
    });

    this.sharedSearchService.searchType$.subscribe((type) => {
      this.searchType = type;
    });
  }

  onSearchQueryChange() {
    this.sharedSearchService.updateSearchQuery(this.searchQuery);
  }
}