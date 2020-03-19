import { TestBed } from '@angular/core/testing';

import { RlpSharedService } from './rlp-shared.service';

describe('RlpSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RlpSharedService = TestBed.get(RlpSharedService);
    expect(service).toBeTruthy();
  });
});
