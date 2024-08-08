import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkdeskComponent } from './workdesk.component';

describe('WorkdeskComponent', () => {
  let component: WorkdeskComponent;
  let fixture: ComponentFixture<WorkdeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkdeskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkdeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
