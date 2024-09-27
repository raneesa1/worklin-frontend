import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultModalComponent } from './display-result-modal.component';

describe('DisplayResultModalComponent', () => {
  let component: DisplayResultModalComponent;
  let fixture: ComponentFixture<DisplayResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayResultModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
