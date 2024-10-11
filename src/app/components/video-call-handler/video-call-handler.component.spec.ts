import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallHandlerComponent } from './video-call-handler.component';

describe('VideoCallHandlerComponent', () => {
  let component: VideoCallHandlerComponent;
  let fixture: ComponentFixture<VideoCallHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCallHandlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCallHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
