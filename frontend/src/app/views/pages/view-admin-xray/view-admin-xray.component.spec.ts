import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdminXrayComponent } from './view-admin-xray.component';

describe('ViewAdminXrayComponent', () => {
  let component: ViewAdminXrayComponent;
  let fixture: ComponentFixture<ViewAdminXrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAdminXrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAdminXrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
