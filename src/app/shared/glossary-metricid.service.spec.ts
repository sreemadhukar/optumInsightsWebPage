import { TestBed } from '@angular/core/testing';

import { GlossaryMetricidService } from './glossary-metricid.service';

describe('GlossaryMetricidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlossaryMetricidService = TestBed.get(GlossaryMetricidService);
    expect(service).toBeTruthy();
  });
});
