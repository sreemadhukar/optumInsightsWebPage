import { AcoModule } from './aco.module';

describe('AcoModule', () => {
  let acoModule: AcoModule;

  beforeEach(() => {
    acoModule = new AcoModule();
  });

  it('should create an instance', () => {
    expect(acoModule).toBeTruthy();
  });
});
