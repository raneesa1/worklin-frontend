import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostHiresComponent } from './job-post-hires.component';

describe('JobPostHiresComponent', () => {
  let component: JobPostHiresComponent;
  let fixture: ComponentFixture<JobPostHiresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPostHiresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostHiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
