import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRateFromPreviewModalComponent } from './edit-rate-from-preview-modal.component';

describe('EditRateFromPreviewModalComponent', () => {
  let component: EditRateFromPreviewModalComponent;
  let fixture: ComponentFixture<EditRateFromPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRateFromPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRateFromPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
