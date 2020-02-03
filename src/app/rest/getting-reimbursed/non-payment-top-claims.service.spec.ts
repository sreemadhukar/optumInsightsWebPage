import { TestBed } from '@angular/core/testing';

import { NonPaymentTopClaimsService } from './non-payment-top-claims.service';

describe('NonPaymentTopClaimsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NonPaymentTopClaimsService = TestBed.get(NonPaymentTopClaimsService);
    expect(service).toBeTruthy();
  });
});
