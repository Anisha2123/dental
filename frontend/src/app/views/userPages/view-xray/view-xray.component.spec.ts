import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewXrayComponent } from './view-xray.component';

describe('ViewXrayComponent', () => {
  let component: ViewXrayComponent;
  let fixture: ComponentFixture<ViewXrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewXrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewXrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
