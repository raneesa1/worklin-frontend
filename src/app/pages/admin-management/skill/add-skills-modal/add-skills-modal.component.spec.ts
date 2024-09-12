import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillsModalComponent } from './add-skills-modal.component';

describe('AddSkillsModalComponent', () => {
  let component: AddSkillsModalComponent;
  let fixture: ComponentFixture<AddSkillsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSkillsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSkillsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
