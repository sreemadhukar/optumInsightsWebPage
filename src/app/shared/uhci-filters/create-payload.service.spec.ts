import { TestBed } from '@angular/core/testing';

import { CreatePayloadService } from './create-payload.service';

describe('CreatePayloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatePayloadService = TestBed.get(CreatePayloadService);
    expect(service).toBeTruthy();
  });
});
