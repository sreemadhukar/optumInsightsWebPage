import { TestBed } from '@angular/core/testing';

import { NewPaymentIntegrityServiceRest } from './new-payment-integrity-rest.service';

describe('NewPaymentIntegrityServiceRest', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewPaymentIntegrityServiceRest = TestBed.get(NewPaymentIntegrityServiceRest);
    expect(service).toBeTruthy();
  });
});
