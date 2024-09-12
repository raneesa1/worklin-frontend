import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExperienceModalComponent } from './add-experience-modal.component';

describe('AddExperienceModalComponent', () => {
  let component: AddExperienceModalComponent;
  let fixture: ComponentFixture<AddExperienceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExperienceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExperienceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
