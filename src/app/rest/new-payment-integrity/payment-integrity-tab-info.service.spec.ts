import { TestBed } from '@angular/core/testing';

import { PaymentIntegrityTabInfoService } from './payment-integrity-tab-info.service';

describe('PaymentIntegrityTabInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentIntegrityTabInfoService = TestBed.get(PaymentIntegrityTabInfoService);
    expect(service).toBeTruthy();
  });
});
