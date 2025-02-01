import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredDentistsComponent } from './registered-dentists.component';

describe('RegisteredDentistsComponent', () => {
  let component: RegisteredDentistsComponent;
  let fixture: ComponentFixture<RegisteredDentistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredDentistsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredDentistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
