import { TestBed } from '@angular/core/testing';

import { HealthSystemDetailsService } from './health-system-details.service';

describe('HealthSystemDetailsSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HealthSystemDetailsService = TestBed.get(HealthSystemDetailsService);
    expect(service).toBeTruthy();
  });
});
