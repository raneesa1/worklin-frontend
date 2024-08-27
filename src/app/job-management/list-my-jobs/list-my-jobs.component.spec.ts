import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMyJobsComponent } from './list-my-jobs.component';

describe('ListMyJobsComponent', () => {
  let component: ListMyJobsComponent;
  let fixture: ComponentFixture<ListMyJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMyJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMyJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
