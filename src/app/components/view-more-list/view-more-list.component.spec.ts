import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoreListComponent } from './view-more-list.component';

describe('ViewMoreListComponent', () => {
  let component: ViewMoreListComponent;
  let fixture: ComponentFixture<ViewMoreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMoreListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
