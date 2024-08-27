import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoblistViewMoreModalComponent } from './joblist-view-more-modal.component';

describe('JoblistViewMoreModalComponent', () => {
  let component: JoblistViewMoreModalComponent;
  let fixture: ComponentFixture<JoblistViewMoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoblistViewMoreModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoblistViewMoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
