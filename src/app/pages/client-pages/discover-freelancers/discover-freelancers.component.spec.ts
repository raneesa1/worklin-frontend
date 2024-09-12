import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverFreelancersComponent } from './discover-freelancers.component';

describe('DiscoverFreelancersComponent', () => {
  let component: DiscoverFreelancersComponent;
  let fixture: ComponentFixture<DiscoverFreelancersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoverFreelancersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoverFreelancersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
