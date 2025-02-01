import { TestBed } from '@angular/core/testing';

import { SubsAuthGuard } from './subs-auth.guard';

describe('SubsAuthGuard', () => {
  let guard: SubsAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SubsAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
