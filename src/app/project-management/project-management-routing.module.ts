import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './client/projects/projects.component';
import { PaymentsComponent } from './client/payments/payments.component';
import { MemberProfileComponent } from './client/member-profile/member-profile.component';
import { WorkdeskComponent } from './client/workdesk/workdesk.component';
import { MeetingsComponent } from './client/meetings/meetings.component';
import { MembersComponent } from './client/members/members.component';
import { DashboardComponent } from './client/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/payments', component: PaymentsComponent },
  { path: 'projects/member-profile', component: MemberProfileComponent },
  { path: 'projects/workdesk', component: WorkdeskComponent },
  { path: 'projects/meeting', component: MeetingsComponent },
  { path: 'projects/members', component: MembersComponent },
  { path: 'projects/dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectManagementModuleRoutingModule {}
