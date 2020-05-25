import { TestBed } from '@angular/core/testing';

import { ModalPopupService } from './modal-popup.service';

describe('ModalPopupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalPopupService = TestBed.get(ModalPopupService);
    expect(service).toBeTruthy();
  });
});
