import { TestBed } from '@angular/core/testing';

import { SmartEditsService } from './smart-edits.service';

describe('SmartEditsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartEditsService = TestBed.get(SmartEditsService);
    expect(service).toBeTruthy();
  });
});
