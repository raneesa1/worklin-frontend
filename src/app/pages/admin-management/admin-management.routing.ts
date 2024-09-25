import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillManagementComponent } from './skill/skill-management/skill-management.component';
import { CategoryManagementComponent } from './category/category-management/category-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { PaymentsComponent } from '../../shared/pages/payments/payments.component';
 
const routes: Routes = [
  { path: 'skills', component: SkillManagementComponent },
  { path: 'category', component: CategoryManagementComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'users', component: ListUsersComponent },
  { path: 'paymentList', component: PaymentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class adminRoutingModule {}
