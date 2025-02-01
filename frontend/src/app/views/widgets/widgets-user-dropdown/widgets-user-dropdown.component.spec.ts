import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsUserDropdownComponent } from './widgets-user-dropdown.component';

describe('WidgetsUserDropdownComponent', () => {
  let component: WidgetsUserDropdownComponent;
  let fixture: ComponentFixture<WidgetsUserDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetsUserDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsUserDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
