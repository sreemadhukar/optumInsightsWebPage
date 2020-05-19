import { TestBed } from '@angular/core/testing';

import { UserReviewService } from './user-review.service';

describe('UserReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserReviewService = TestBed.get(UserReviewService);
    expect(service).toBeTruthy();
  });
});
