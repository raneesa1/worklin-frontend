import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFreelancersComponent } from './invite-freelancers.component';

describe('InviteFreelancersComponent', () => {
  let component: InviteFreelancersComponent;
  let fixture: ComponentFixture<InviteFreelancersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteFreelancersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteFreelancersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
