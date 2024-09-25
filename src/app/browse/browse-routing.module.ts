import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoverComponent } from '../pages/freelancer-pages/discover-jobs/discover.component';
import { SavedJobsComponent } from '../pages/freelancer-pages/saved-jobs/saved-jobs.component';
import { JobDetailPageComponent } from '../pages/freelancer-pages/job-detail-page/job-detail-page.component';

import { MyProposalsComponent } from '../pages/freelancer-pages/my-proposals/my-proposals.component';
import { InvitesComponent } from '../pages/freelancer-pages/invites/invites.component';
import { MessagesComponent } from '../pages/freelancer-pages/messages/messages.component';
import { DiscoverFreelancersComponent } from '../pages/client-pages/discover-freelancers/discover-freelancers.component';
import { SavedTalentsComponent } from '../pages/client-pages/saved-talents/saved-talents.component';
import { SingleFreelancerProfileViewComponent } from '../pages/client-pages/job-management/single-freelancer-profile-view/single-freelancer-profile-view.component';

const routes: Routes = [
  { path: 'discover', component: DiscoverComponent },
  { path: 'saved-talents', component: SavedTalentsComponent },
  { path: 'saved-jobs', component: SavedJobsComponent },
  { path: 'job-detail', component: JobDetailPageComponent },
  { path: 'freelancer/:id', component: SingleFreelancerProfileViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppModuleRoutingModule {}
