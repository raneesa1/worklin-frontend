import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerSearchComponent } from './freelancer-search.component';

describe('FreelancerSearchComponent', () => {
  let component: FreelancerSearchComponent;
  let fixture: ComponentFixture<FreelancerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelancerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
