import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteToJobModalComponent } from './invite-to-job-modal.component';

describe('InviteToJobModalComponent', () => {
  let component: InviteToJobModalComponent;
  let fixture: ComponentFixture<InviteToJobModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteToJobModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteToJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
