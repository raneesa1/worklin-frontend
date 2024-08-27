import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientintroComponent } from './clientintro/clientintro.component';
import { FreelancerPagetwoComponent } from './freelancer-pagetwo/freelancer-pagetwo.component';
import { FreelancerPageOneComponent } from './freelancer-page-one/freelancer-page-one.component';
import { PageOneComponent } from './create-account-freelancer/resume/page-one.component';
import { EducationComponent } from './create-account-freelancer/education/education.component';
import { ExperienceComponent } from './create-account-freelancer/experience/experience.component';
import { TitleComponent } from './create-account-freelancer/title/title.component';
import { SkillsComponent } from './create-account-freelancer/skills/skills.component';
import { OverviewComponent } from './create-account-freelancer/overview/overview.component';
import { RateComponent } from './create-account-freelancer/rate/rate.component';
import { LanguageComponent } from './create-account-freelancer/language/language.component';
import { CategoryComponent } from './create-account-freelancer/category/category.component';
import { LocationComponent } from './create-account-freelancer/location/location.component';
import { PreviewComponent } from './create-account-freelancer/preview/preview.component';
import { FreelancerProfileComponent } from './freelancer-profile/freelancer-profile.component';
import { DatePickerComponent } from './create-account-freelancer/date-picker/date-picker.component';
import { SkillManagementComponent } from '../admin-management/skill/skill-management/skill-management.component';
import { PhotoUploadModalComponent } from './create-account-freelancer/photo-upload-modal/photo-upload-modal.component';
import { ProfileCreatedComponent } from './profile-created/profile-created.component';
import { ListFreelancersComponent } from '../admin-management/list-freelancers/list-freelancers.component';

const routes: Routes = [
  { path: 'page-two', component: FreelancerPagetwoComponent },
  { path: 'page-one', component: FreelancerPageOneComponent },
  { path: 'create-account-resume', component: PageOneComponent },
  { path: 'create-account-education', component: EducationComponent },
  { path: 'create-account-experience', component: ExperienceComponent },
  { path: 'create-account-title', component: TitleComponent },
  { path: 'create-account-skills', component: SkillsComponent },
  { path: 'create-account-overview', component: OverviewComponent },
  { path: 'create-account-rate', component: RateComponent },
  { path: 'create-account-language', component: LanguageComponent },
  { path: 'create-account-category', component: CategoryComponent },
  { path: 'create-account-location', component: LocationComponent },
  { path: 'create-account-preview', component: PreviewComponent },
  { path: 'myProfile', component: FreelancerProfileComponent },
  { path: 'upload', component: PhotoUploadModalComponent },
  { path: 'profileCreated', component: ProfileCreatedComponent },
  { path: 'freelancers', component: ListFreelancersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
