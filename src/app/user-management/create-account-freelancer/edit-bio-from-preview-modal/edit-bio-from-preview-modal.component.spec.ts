import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBioFromPreviewModalComponent } from './edit-bio-from-preview-modal.component';

describe('EditBioFromPreviewModalComponent', () => {
  let component: EditBioFromPreviewModalComponent;
  let fixture: ComponentFixture<EditBioFromPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBioFromPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBioFromPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
