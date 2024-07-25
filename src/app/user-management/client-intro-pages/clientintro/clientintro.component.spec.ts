import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientintroComponent } from './clientintro.component';

describe('ClientintroComponent', () => {
  let component: ClientintroComponent;
  let fixture: ComponentFixture<ClientintroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientintroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientintroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
