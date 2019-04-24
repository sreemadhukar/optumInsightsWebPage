import { TestBed } from '@angular/core/testing';

import { GettingReimbursedService } from './getting-reimbursed.service';

describe('GettingReimbursedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GettingReimbursedService = TestBed.get(GettingReimbursedService);
    expect(service).toBeTruthy();
  });
});
