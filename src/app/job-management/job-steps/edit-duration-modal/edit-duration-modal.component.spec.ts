import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDurationModalComponent } from './edit-duration-modal.component';

describe('EditDurationModalComponent', () => {
  let component: EditDurationModalComponent;
  let fixture: ComponentFixture<EditDurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDurationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
