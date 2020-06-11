import { TestBed } from '@angular/core/testing';

import { SmartEditsSharedService } from './smart-edits-shared.service';

describe('SmartEditsSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartEditsSharedService = TestBed.get(SmartEditsSharedService);
    expect(service).toBeTruthy();
  });
});
