import { TestBed } from '@angular/core/testing';

import { GettingReimbursedSharedService } from './getting-reimbursed-shared.service';

describe('GettingReimbursedSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GettingReimbursedSharedService = TestBed.get(GettingReimbursedSharedService);
    expect(service).toBeTruthy();
  });
});
