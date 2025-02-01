import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayFailureComponent } from './pay-failure.component';

describe('PayFailureComponent', () => {
  let component: PayFailureComponent;
  let fixture: ComponentFixture<PayFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayFailureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
