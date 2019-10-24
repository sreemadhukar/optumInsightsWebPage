import { TestBed } from '@angular/core/testing';

import { AcoSharedService } from './aco-shared.service';

describe('AcoSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcoSharedService = TestBed.get(AcoSharedService);
    expect(service).toBeTruthy();
  });
});
