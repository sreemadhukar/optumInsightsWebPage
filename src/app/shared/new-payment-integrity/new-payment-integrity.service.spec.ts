import { TestBed } from '@angular/core/testing';

import { NewPaymentIntegrityService } from './new-payment-integrity.service';

describe('NewPaymentIntegrityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewPaymentIntegrityService = TestBed.get(NewPaymentIntegrityService);
    expect(service).toBeTruthy();
  });
});
