import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateXrayComponent } from './evaluate-xray.component';

describe('EvaluateXrayComponent', () => {
  let component: EvaluateXrayComponent;
  let fixture: ComponentFixture<EvaluateXrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluateXrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluateXrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
