import { TestBed } from '@angular/core/testing';

import { ProviderSharedService } from './provider-shared.service';

describe('ProviderSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProviderSharedService = TestBed.get(ProviderSharedService);
    expect(service).toBeTruthy();
  });
});
