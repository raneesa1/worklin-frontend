import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerPagetwoComponent } from './freelancer-pagetwo.component';

describe('FreelancerPagetwoComponent', () => {
  let component: FreelancerPagetwoComponent;
  let fixture: ComponentFixture<FreelancerPagetwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerPagetwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelancerPagetwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
