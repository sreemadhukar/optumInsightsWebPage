import { TestBed } from '@angular/core/testing';

import { AcoService } from './aco.service';

describe('AcoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcoService = TestBed.get(AcoService);
    expect(service).toBeTruthy();
  });
});
