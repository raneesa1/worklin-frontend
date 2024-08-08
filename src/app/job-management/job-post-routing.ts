import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepOneComponent } from './job-steps/step-one/step-one.component';
import { StepTwoComponent } from './job-steps/step-two/step-two.component';
import { StepThirdComponent } from './job-steps/step-three/step-third.component';
import { StepFourComponent } from './job-steps/step-four/step-four.component';
import { StepFiveComponent } from './job-steps/step-five/step-five.component';
import { ReviewPostComponent } from './job-steps/review-post/review-post.component';
import { SkillManagementComponent } from '../admin-management/skill/skill-management/skill-management.component';
import { ClientintroComponent } from '../user-management/clientintro/clientintro.component';
import { CategoryManagementComponent } from '../admin-management/category/category-management/category-management.component';

const routes: Routes = [
  { path: 'stepOne', component: StepOneComponent },
  { path: 'clientIntro', component: ClientintroComponent },
  { path: 'stepTwo', component: StepTwoComponent },
  { path: 'stepThree', component: StepThirdComponent },
  { path: 'stepFour', component: StepFourComponent },
  { path: 'stepFive', component: StepFiveComponent },
  { path: 'reviewPost', component: ReviewPostComponent },
  { path: 'admin/skills', component: SkillManagementComponent },
  { path: 'admin/category', component: CategoryManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class jobPostRoutingModule {}
