import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadXrayComponent } from './upload-xray.component';

describe('UploadXrayComponent', () => {
  let component: UploadXrayComponent;
  let fixture: ComponentFixture<UploadXrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadXrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadXrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
