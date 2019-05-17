import { RestModule } from './rest.module';

describe('RestModule', () => {
  let restModule: RestModule;

  beforeEach(() => {
    restModule = new RestModule();
  });

  it('should create an instance', () => {
    expect(restModule).toBeTruthy();
  });
});
