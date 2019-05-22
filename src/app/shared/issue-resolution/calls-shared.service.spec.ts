import { TestBed } from '@angular/core/testing';

import { CallsSharedService } from './calls-shared.service';

describe('CallsSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallsSharedService = TestBed.get(CallsSharedService);
    expect(service).toBeTruthy();
  });
});
