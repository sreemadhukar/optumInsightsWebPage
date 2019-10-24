import { TestBed } from '@angular/core/testing';

import { RefreshtokenService } from './refreshtoken.service';

describe('RefreshtokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefreshtokenService = TestBed.get(RefreshtokenService);
    expect(service).toBeTruthy();
  });
});
