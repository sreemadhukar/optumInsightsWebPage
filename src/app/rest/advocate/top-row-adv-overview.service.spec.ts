import { TestBed } from '@angular/core/testing';

import { TopRowAdvOverviewService } from './top-row-adv-overview.service';

describe('TopRowAdvOverviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopRowAdvOverviewService = TestBed.get(TopRowAdvOverviewService);
    expect(service).toBeTruthy();
  });
});
