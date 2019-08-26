import { TestBed } from '@angular/core/testing';

import { NonPaymentSharedService } from './non-payment-shared.service';

describe('NonPaymentSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NonPaymentSharedService = TestBed.get(NonPaymentSharedService);
    expect(service).toBeTruthy();
  });
});
