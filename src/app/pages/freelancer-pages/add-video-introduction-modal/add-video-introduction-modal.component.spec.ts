import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoIntroductionModalComponent } from './add-video-introduction-modal.component';

describe('AddVideoIntroductionModalComponent', () => {
  let component: AddVideoIntroductionModalComponent;
  let fixture: ComponentFixture<AddVideoIntroductionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVideoIntroductionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVideoIntroductionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
