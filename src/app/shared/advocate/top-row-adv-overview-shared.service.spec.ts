import { TestBed } from '@angular/core/testing';

import { TopRowAdvOverviewSharedService } from './top-row-adv-overview-shared.service';

describe('TopRowAdvOverviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopRowAdvOverviewSharedService = TestBed.get(TopRowAdvOverviewSharedService);
    expect(service).toBeTruthy();
  });
});
