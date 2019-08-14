import { TestBed } from '@angular/core/testing';

import { PatientCareOpportunityService } from './patient-care-opportunity.service';

describe('PatientCareOpportunityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PatientCareOpportunityService = TestBed.get(PatientCareOpportunityService);
    expect(service).toBeTruthy();
  });
});
