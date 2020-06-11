import { KnowOurProviderModule } from './know-our-provider.module';

describe('KnowOurProviderModule', () => {
  let knowOurProviderModule: KnowOurProviderModule;

  beforeEach(() => {
    knowOurProviderModule = new KnowOurProviderModule();
  });

  it('should create an instance', () => {
    expect(knowOurProviderModule).toBeTruthy();
  });
});
