import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeUploadModalComponent } from './resume-upload-modal.component';

describe('ResumeUploadModalComponent', () => {
  let component: ResumeUploadModalComponent;
  let fixture: ComponentFixture<ResumeUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeUploadModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
