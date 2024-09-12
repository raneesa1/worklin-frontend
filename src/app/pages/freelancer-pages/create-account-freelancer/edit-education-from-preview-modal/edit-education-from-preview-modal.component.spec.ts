import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEducationFromPreviewModalComponent } from './edit-education-from-preview-modal.component';

describe('EditEducationFromPreviewModalComponent', () => {
  let component: EditEducationFromPreviewModalComponent;
  let fixture: ComponentFixture<EditEducationFromPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEducationFromPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEducationFromPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
