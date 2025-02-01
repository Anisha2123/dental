import { TestBed } from '@angular/core/testing';

import { UserRoleDentistGuard } from './user-role-dentist.guard';

describe('UserRoleDentistGuard', () => {
  let guard: UserRoleDentistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserRoleDentistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
