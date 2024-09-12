import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExperienceLevelModalComponent } from './edit-experience-level-modal.component';

describe('EditExperienceLevelModalComponent', () => {
  let component: EditExperienceLevelModalComponent;
  let fixture: ComponentFixture<EditExperienceLevelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExperienceLevelModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExperienceLevelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
