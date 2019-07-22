import { TestBed } from '@angular/core/testing';

import { TrendingMetricsService } from './trending-metrics.service';

describe('TrendingMetricsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrendingMetricsService = TestBed.get(TrendingMetricsService);
    expect(service).toBeTruthy();
  });
});
