import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientintroComponent } from './clientintro/clientintro.component';
import { StepOneComponent } from './job-management/job-steps/step-one/step-one.component';
import { StepFiveComponent } from './job-management/job-steps/step-five/step-five.component';
import { ReviewPostComponent } from './job-management/job-steps/review-post/review-post.component';
import { BudgetComponent } from './job-management/job-steps/budget/budget.component';
import { JobPostedNotificationComponent } from './job-management/job-posted-notification/job-posted-notification.component';
import { ListMyJobsComponent } from './job-management/list-my-jobs/list-my-jobs.component';
import { ManageJobPostComponent } from './job-management/manage-job-post/manage-job-post.component';
import { FreelancerProfileComponent } from '../freelancer-pages/freelancer-profile/freelancer-profile.component';
import { SkillManagementComponent } from '../admin-management/skill/skill-management/skill-management.component';
import { CategoryManagementComponent } from '../admin-management/category/category-management/category-management.component';
import { ListFreelancersComponent } from '../admin-management/list-freelancers/list-freelancers.component';
import { InvitesComponent } from '../freelancer-pages/invites/invites.component';
import { MyProposalsComponent } from '../freelancer-pages/my-proposals/my-proposals.component';
import { DiscoverFreelancersComponent } from './discover-freelancers/discover-freelancers.component';
import { MessagesComponent } from '../freelancer-pages/messages/messages.component';
import { ClientSearchComponent } from './client-search/client-search.component';

const routes: Routes = [
  { path: 'clientIntro', component: ClientintroComponent },
  { path: 'jobPost', component: StepOneComponent },
  { path: 'stepFive', component: StepFiveComponent },
  { path: 'reviewPost', component: ReviewPostComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'admin/skills', component: SkillManagementComponent },
  { path: 'admin/category', component: CategoryManagementComponent },
  { path: 'job-posted', component: JobPostedNotificationComponent },
  { path: 'list-my-jobs', component: ListMyJobsComponent },
  { path: 'applications', component: ManageJobPostComponent },
  { path: 'admin/users', component: ListFreelancersComponent },
  { path: 'my-proposals', component: MyProposalsComponent },
  { path: 'invites', component: InvitesComponent },
  { path: 'applicant/:id', component: FreelancerProfileComponent },
  { path: 'messages', component: MessagesComponent},
  { path: 'discover-freelancers', component: DiscoverFreelancersComponent },
  { path: 'search', component: ClientSearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
