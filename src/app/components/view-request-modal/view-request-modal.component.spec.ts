import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestModalComponent } from './view-request-modal.component';

describe('ViewRequestModalComponent', () => {
  let component: ViewRequestModalComponent;
  let fixture: ComponentFixture<ViewRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRequestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
