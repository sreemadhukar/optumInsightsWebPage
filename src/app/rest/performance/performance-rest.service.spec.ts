import { TestBed } from '@angular/core/testing';

import { PerformanceRestService } from './performance-rest.service';

describe('PerformanceRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerformanceRestService = TestBed.get(PerformanceRestService);
    expect(service).toBeTruthy();
  });
});
