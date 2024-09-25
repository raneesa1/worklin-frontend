import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneInputsComponent } from './milestone-inputs.component';

describe('MilestoneInputsComponent', () => {
  let component: MilestoneInputsComponent;
  let fixture: ComponentFixture<MilestoneInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneInputsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MilestoneInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
