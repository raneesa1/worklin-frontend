import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExperienceFromPreviewModalComponent } from './edit-experience-from-preview-modal.component';

describe('EditExperienceFromPreviewModalComponent', () => {
  let component: EditExperienceFromPreviewModalComponent;
  let fixture: ComponentFixture<EditExperienceFromPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExperienceFromPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExperienceFromPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
