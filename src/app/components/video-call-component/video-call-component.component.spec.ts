import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallComponentComponent } from './video-call-component.component';

describe('VideoCallComponentComponent', () => {
  let component: VideoCallComponentComponent;
  let fixture: ComponentFixture<VideoCallComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCallComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCallComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
