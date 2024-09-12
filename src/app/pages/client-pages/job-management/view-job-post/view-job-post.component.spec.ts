import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJobPostComponent } from './view-job-post.component';

describe('ViewJobPostComponent', () => {
  let component: ViewJobPostComponent;
  let fixture: ComponentFixture<ViewJobPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewJobPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewJobPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
