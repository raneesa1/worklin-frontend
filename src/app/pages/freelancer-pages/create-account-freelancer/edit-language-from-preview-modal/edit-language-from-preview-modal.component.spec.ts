import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLanguageFromPreviewModalComponent } from './edit-language-from-preview-modal.component';

describe('EditLanguageFromPreviewModalComponent', () => {
  let component: EditLanguageFromPreviewModalComponent;
  let fixture: ComponentFixture<EditLanguageFromPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLanguageFromPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLanguageFromPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
