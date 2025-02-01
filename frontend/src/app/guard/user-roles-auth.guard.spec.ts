import { TestBed } from '@angular/core/testing';

import { UserRolesAuthGuard } from './user-roles-auth.guard';

describe('UserRolesAuthGuard', () => {
  let guard: UserRolesAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserRolesAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
