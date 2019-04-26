import { TestBed } from '@angular/core/testing';

import { GlossaryService } from './glossary.service';

describe('GlossaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlossaryService = TestBed.get(GlossaryService);
    expect(service).toBeTruthy();
  });
});
