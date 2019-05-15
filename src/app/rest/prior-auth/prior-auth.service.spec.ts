import { TestBed } from '@angular/core/testing';

import { PriorAuthService } from './prior-auth.service';

describe('PriorAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriorAuthService = TestBed.get(PriorAuthService);
    expect(service).toBeTruthy();
  });
});
