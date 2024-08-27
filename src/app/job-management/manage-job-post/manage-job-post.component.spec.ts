import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobPostComponent } from './manage-job-post.component';

describe('ManageJobPostComponent', () => {
  let component: ManageJobPostComponent;
  let fixture: ComponentFixture<ManageJobPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageJobPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageJobPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
