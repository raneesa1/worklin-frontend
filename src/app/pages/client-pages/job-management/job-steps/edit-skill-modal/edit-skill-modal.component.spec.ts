import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillModalComponent } from './edit-skill-modal.component';

describe('EditSkillModalComponent', () => {
  let component: EditSkillModalComponent;
  let fixture: ComponentFixture<EditSkillModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSkillModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSkillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
