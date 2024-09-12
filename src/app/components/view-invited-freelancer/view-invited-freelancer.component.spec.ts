import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvitedFreelancerComponent } from './view-invited-freelancer.component';

describe('ViewInvitedFreelancerComponent', () => {
  let component: ViewInvitedFreelancerComponent;
  let fixture: ComponentFixture<ViewInvitedFreelancerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInvitedFreelancerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInvitedFreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
