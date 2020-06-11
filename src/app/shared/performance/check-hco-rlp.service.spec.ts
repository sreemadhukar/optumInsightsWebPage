import { TestBed } from '@angular/core/testing';

import { CheckHcoRlpService } from './check-hco-rlp.service';

describe('CheckHcoRlpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckHcoRlpService = TestBed.get(CheckHcoRlpService);
    expect(service).toBeTruthy();
  });
});
