import { TestBed } from '@angular/core/testing';

import { SubscribeAuthGuard } from './subscribe-auth.guard';

describe('SubscribeAuthGuard', () => {
  let guard: SubscribeAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SubscribeAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
