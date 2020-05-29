import { TestBed } from '@angular/core/testing';

import { KopInsightsService } from './kop-insights.service';

describe('KopInsightsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KopInsightsService = TestBed.get(KopInsightsService);
    expect(service).toBeTruthy();
  });
});
