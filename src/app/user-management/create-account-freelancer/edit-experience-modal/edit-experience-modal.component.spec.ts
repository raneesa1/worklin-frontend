import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExperienceModalComponent } from './edit-experience-modal.component';

describe('EditExperienceModalComponent', () => {
  let component: EditExperienceModalComponent;
  let fixture: ComponentFixture<EditExperienceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExperienceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExperienceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
