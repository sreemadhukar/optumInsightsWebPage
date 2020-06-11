import { TestBed } from '@angular/core/testing';

import { SummarySharedService } from './summary-shared.service';

describe('SummarySharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SummarySharedService = TestBed.get(SummarySharedService);
    expect(service).toBeTruthy();
  });
});
