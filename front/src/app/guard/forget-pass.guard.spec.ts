import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { forgetPassGuard } from './forget-pass.guard';

describe('forgetPassGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => forgetPassGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
