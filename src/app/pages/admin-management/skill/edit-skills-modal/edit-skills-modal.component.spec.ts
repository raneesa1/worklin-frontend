import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillsModalComponent } from './edit-skills-modal.component';

describe('EditSkillsModalComponent', () => {
  let component: EditSkillsModalComponent;
  let fixture: ComponentFixture<EditSkillsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSkillsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSkillsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
