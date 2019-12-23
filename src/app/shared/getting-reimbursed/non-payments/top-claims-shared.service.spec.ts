import { TestBed } from '@angular/core/testing';

import { TopClaimsSharedService } from './top-claims-shared.service';

describe('TopClaimsSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopClaimsSharedService = TestBed.get(TopClaimsSharedService);
    expect(service).toBeTruthy();
  });
});
