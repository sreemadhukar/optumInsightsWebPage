import { TestBed } from '@angular/core/testing';

import { GroupPremiumDesignationService } from './group-premium-designation.service';

describe('GroupPremiumDesignationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupPremiumDesignationService = TestBed.get(GroupPremiumDesignationService);
    expect(service).toBeTruthy();
  });
});
