import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalIncomingCallComponent } from './global-incoming-call.component';

describe('GlobalIncomingCallComponent', () => {
  let component: GlobalIncomingCallComponent;
  let fixture: ComponentFixture<GlobalIncomingCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalIncomingCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalIncomingCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
