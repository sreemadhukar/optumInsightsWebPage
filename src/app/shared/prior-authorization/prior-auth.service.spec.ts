import { TestBed } from '@angular/core/testing';

import { PriorAuthSharedService } from './prior-auth.service';

describe('PriorAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriorAuthSharedService = TestBed.get(PriorAuthSharedService);
    expect(service).toBeTruthy();
  });
});
