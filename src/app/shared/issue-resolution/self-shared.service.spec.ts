import { TestBed } from '@angular/core/testing';

import { SelfSharedService } from './self-shared.service';

describe('SelfSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelfSharedService = TestBed.get(SelfSharedService);
    expect(service).toBeTruthy();
  });
});
