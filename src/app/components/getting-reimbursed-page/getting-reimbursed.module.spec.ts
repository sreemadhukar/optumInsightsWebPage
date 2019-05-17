import { GettingReimbursedModule } from './getting-reimbursed.module';

describe('GettingReimbursedModule', () => {
  let gettingReimbursedModule: GettingReimbursedModule;

  beforeEach(() => {
    gettingReimbursedModule = new GettingReimbursedModule();
  });

  it('should create an instance', () => {
    expect(gettingReimbursedModule).toBeTruthy();
  });
});
