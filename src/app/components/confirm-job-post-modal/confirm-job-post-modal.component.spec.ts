import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmJobPostModalComponent } from './confirm-job-post-modal.component';

describe('ConfirmJobPostModalComponent', () => {
  let component: ConfirmJobPostModalComponent;
  let fixture: ComponentFixture<ConfirmJobPostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmJobPostModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmJobPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
