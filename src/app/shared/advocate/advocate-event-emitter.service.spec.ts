import { TestBed } from '@angular/core/testing';

import { AdvocateEventEmitterService } from './advocate-event-emitter.service';

describe('AdvocateEventEmitterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvocateEventEmitterService = TestBed.get(AdvocateEventEmitterService);
    expect(service).toBeTruthy();
  });
});
