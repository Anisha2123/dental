import { TestBed } from '@angular/core/testing';

import { DashboardProfileCheckGuard } from './dashboard-profile-check.guard';

describe('DashboardProfileCheckGuard', () => {
  let guard: DashboardProfileCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DashboardProfileCheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
