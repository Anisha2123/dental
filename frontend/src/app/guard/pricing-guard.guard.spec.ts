import { TestBed } from '@angular/core/testing';

import { PricingGuardGuard } from './pricing-guard.guard';

describe('PricingGuardGuard', () => {
  let guard: PricingGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PricingGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
