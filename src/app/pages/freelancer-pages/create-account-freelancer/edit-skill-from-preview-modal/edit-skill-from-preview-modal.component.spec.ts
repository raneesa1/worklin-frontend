import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillFromPreviewModalComponent } from './edit-skill-from-preview-modal.component';

describe('EditSkillFromPreviewModalComponent', () => {
  let component: EditSkillFromPreviewModalComponent;
  let fixture: ComponentFixture<EditSkillFromPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSkillFromPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSkillFromPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
