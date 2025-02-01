import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewSubComponent } from './renew-sub.component';

describe('RenewSubComponent', () => {
  let component: RenewSubComponent;
  let fixture: ComponentFixture<RenewSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewSubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
