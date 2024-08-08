import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerPageOneComponent } from './freelancer-page-one.component';

describe('FreelancerPageOneComponent', () => {
  let component: FreelancerPageOneComponent;
  let fixture: ComponentFixture<FreelancerPageOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerPageOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelancerPageOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
