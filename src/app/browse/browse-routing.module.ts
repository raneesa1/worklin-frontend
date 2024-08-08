import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoverComponent } from './discover-talents/discover.component';
import { SavedTalentsComponent } from './saved-talents/saved-talents.component';
import { SavedJobsComponent } from './saved-jobs/saved-jobs.component';
import { JobDetailPageComponent } from './job-detail-page/job-detail-page.component';

const routes: Routes = [
  { path: 'discover', component: DiscoverComponent },
  { path: 'saved-talents', component: SavedTalentsComponent },
  { path: 'saved-jobs', component: SavedJobsComponent },
  { path: 'job-detail', component: JobDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowserModuleRoutingModule {}
