import { TestBed } from '@angular/core/testing';

import { SummaryTrendsSharedService } from './summary-trends-shared.service';

describe('SummaryTrendsSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SummaryTrendsSharedService = TestBed.get(SummaryTrendsSharedService);
    expect(service).toBeTruthy();
  });
});
