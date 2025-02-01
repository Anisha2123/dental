import { TestBed } from '@angular/core/testing';

import { NonUserAuthGuard } from './non-user-auth.guard';

describe('NonUserAuthGuard', () => {
  let guard: NonUserAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonUserAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
