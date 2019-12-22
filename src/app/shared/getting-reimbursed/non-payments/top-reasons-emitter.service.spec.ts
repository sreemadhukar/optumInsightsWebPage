import { TestBed } from '@angular/core/testing';

import { TopReasonsEmitterService } from './top-reasons-emitter.service';

describe('TopReasonsEmitterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopReasonsEmitterService = TestBed.get(TopReasonsEmitterService);
    expect(service).toBeTruthy();
  });
});
