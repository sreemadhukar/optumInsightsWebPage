import { TestBed } from '@angular/core/testing';

import { FilterExpandService } from './filter-expand.service';

describe('FilterExpandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterExpandService = TestBed.get(FilterExpandService);
    expect(service).toBeTruthy();
  });
});
