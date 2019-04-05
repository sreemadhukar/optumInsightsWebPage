import { TestBed } from '@angular/core/testing';

import { OverviewSharedService } from './overview-shared.service';

describe('OverviewSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverviewSharedService = TestBed.get(OverviewSharedService);
    expect(service).toBeTruthy();
  });
});
