import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillManagementComponent } from './skill/skill-management/skill-management.component';
import { CategoryManagementComponent } from './category/category-management/category-management.component';

const routes: Routes = [
  { path: 'admin/skills', component: SkillManagementComponent },
  { path: 'admin/category', component: CategoryManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class adminRoutingModule {}
