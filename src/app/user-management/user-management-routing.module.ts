import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientintroComponent } from './client-intro-pages/clientintro/clientintro.component';
import { StepOneComponent } from './client-intro-pages/step-one/step-one.component';
import { StepTwoComponent } from './client-intro-pages/step-two/step-two.component';
import { StepThirdComponent } from './client-intro-pages/step-third/step-third.component';
import { StepFourComponent } from './client-intro-pages/step-four/step-four.component';
import { StepFiveComponent } from './client-intro-pages/step-five/step-five.component';

const routes: Routes = [
  { path: 'clientIntro', component: ClientintroComponent },
  { path: 'clientStepOne', component: StepOneComponent },
  { path: 'clientStepTwo', component: StepTwoComponent },
  { path: 'clientStepThird', component: StepThirdComponent },
  { path: 'clientStepFour', component: StepFourComponent },
  { path: 'clientStepFive', component: StepFiveComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
