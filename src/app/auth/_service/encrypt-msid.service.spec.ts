import { TestBed } from '@angular/core/testing';

import { EncryptMsidService } from './encrypt-msid.service';

describe('EncryptMsidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncryptMsidService = TestBed.get(EncryptMsidService);
    expect(service).toBeTruthy();
  });
});
