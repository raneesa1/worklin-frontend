import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostedNotificationComponent } from './job-posted-notification.component';

describe('JobPostedNotificationComponent', () => {
  let component: JobPostedNotificationComponent;
  let fixture: ComponentFixture<JobPostedNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPostedNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostedNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
