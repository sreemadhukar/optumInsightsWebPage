import { TestBed } from '@angular/core/testing';

import { KopInsightsRestService } from './kop-insights-rest.service';

describe('KopInsightsRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KopInsightsRestService = TestBed.get(KopInsightsRestService);
    expect(service).toBeTruthy();
  });
});
