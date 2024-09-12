import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteStatusNotificationComponent } from './invite-status-notification.component';

describe('InviteStatusNotificationComponent', () => {
  let component: InviteStatusNotificationComponent;
  let fixture: ComponentFixture<InviteStatusNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteStatusNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteStatusNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
