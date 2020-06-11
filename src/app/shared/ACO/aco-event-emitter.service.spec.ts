import { TestBed } from '@angular/core/testing';

import { AcoEventEmitterService } from './aco-event-emitter.service';

describe('AcoEventEmitterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcoEventEmitterService = TestBed.get(AcoEventEmitterService);
    expect(service).toBeTruthy();
  });
});
