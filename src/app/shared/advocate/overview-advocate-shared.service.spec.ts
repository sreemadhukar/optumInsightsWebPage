import { TestBed } from '@angular/core/testing';

import { OverviewAdvocateSharedService } from './overview-advocate-shared.service';

describe('OverviewAdvocateSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverviewAdvocateSharedService = TestBed.get(OverviewAdvocateSharedService);
    expect(service).toBeTruthy();
  });
});
