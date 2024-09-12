import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFreelancerProfileViewComponent } from './single-freelancer-profile-view.component';

describe('SingleFreelancerProfileViewComponent', () => {
  let component: SingleFreelancerProfileViewComponent;
  let fixture: ComponentFixture<SingleFreelancerProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleFreelancerProfileViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleFreelancerProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
