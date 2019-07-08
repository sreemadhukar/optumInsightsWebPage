import { TestBed } from '@angular/core/testing';

import { CallsTrendService } from './calls-trend.service';

describe('CallsTrendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallsTrendService = TestBed.get(CallsTrendService);
    expect(service).toBeTruthy();
  });
});
