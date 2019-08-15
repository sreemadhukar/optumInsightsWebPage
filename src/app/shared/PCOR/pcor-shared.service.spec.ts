import { TestBed } from '@angular/core/testing';

import { PCORSharedService } from './pcor-shared.service';

describe('PCORSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PCORSharedService = TestBed.get(PCORSharedService);
    expect(service).toBeTruthy();
  });
});
