import { TestBed } from '@angular/core/testing';

import { OverviewAdvocateService } from './overview-advocate.service';

describe('OverviewAdvocateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverviewAdvocateService = TestBed.get(OverviewAdvocateService);
    expect(service).toBeTruthy();
  });
});
