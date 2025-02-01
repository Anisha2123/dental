import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkXrayComponent } from './mark-xray.component';

describe('MarkXrayComponent', () => {
  let component: MarkXrayComponent;
  let fixture: ComponentFixture<MarkXrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkXrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkXrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
