import { AdvocateModule } from './advocate.module';

describe('AdvocateModule', () => {
  let advocateModule: AdvocateModule;

  beforeEach(() => {
    advocateModule = new AdvocateModule();
  });

  it('should create an instance', () => {
    expect(advocateModule).toBeTruthy();
  });
});
