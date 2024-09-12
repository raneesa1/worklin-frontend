import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailPageComponent } from './job-detail-page.component';

describe('JobDetailPageComponent', () => {
  let component: JobDetailPageComponent;
  let fixture: ComponentFixture<JobDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
