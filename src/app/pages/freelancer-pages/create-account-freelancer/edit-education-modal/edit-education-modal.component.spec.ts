import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEducationModalComponent } from './edit-education-modal.component';

describe('EditEducationModalComponent', () => {
  let component: EditEducationModalComponent;
  let fixture: ComponentFixture<EditEducationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEducationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEducationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
