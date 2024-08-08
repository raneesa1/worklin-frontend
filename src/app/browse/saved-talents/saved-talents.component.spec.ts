import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTalentsComponent } from './saved-talents.component';

describe('SavedTalentsComponent', () => {
  let component: SavedTalentsComponent;
  let fixture: ComponentFixture<SavedTalentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedTalentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedTalentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
