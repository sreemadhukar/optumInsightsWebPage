import { TestBed } from '@angular/core/testing';

import { GlossaryExpandService } from './glossary-expand.service';

describe('GlossaryExpandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlossaryExpandService = TestBed.get(GlossaryExpandService);
    expect(service).toBeTruthy();
  });
});
