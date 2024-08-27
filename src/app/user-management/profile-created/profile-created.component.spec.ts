import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCreatedComponent } from './profile-created.component';

describe('ProfileCreatedComponent', () => {
  let component: ProfileCreatedComponent;
  let fixture: ComponentFixture<ProfileCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCreatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
