import { TestBed } from '@angular/core/testing';

import { HealthSystemDetailsSharedService } from './health-system-details-shared.service';

describe('HealthSystemDetailsSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HealthSystemDetailsSharedService = TestBed.get(HealthSystemDetailsSharedService);
    expect(service).toBeTruthy();
  });
});
