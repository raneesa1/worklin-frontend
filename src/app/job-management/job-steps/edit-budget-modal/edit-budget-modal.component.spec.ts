import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetModalComponent } from './edit-budget-modal.component';

describe('EditBudgetModalComponent', () => {
  let component: EditBudgetModalComponent;
  let fixture: ComponentFixture<EditBudgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBudgetModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBudgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
