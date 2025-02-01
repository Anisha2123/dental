import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedXraysComponent } from './uploaded-xrays.component';

describe('UploadedXraysComponent', () => {
  let component: UploadedXraysComponent;
  let fixture: ComponentFixture<UploadedXraysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedXraysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedXraysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
