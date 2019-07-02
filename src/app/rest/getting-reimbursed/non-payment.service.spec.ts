import { TestBed } from '@angular/core/testing';

import { NonPaymentService } from './non-payment.service';

describe('NonPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NonPaymentService = TestBed.get(NonPaymentService);
    expect(service).toBeTruthy();
  });
});
