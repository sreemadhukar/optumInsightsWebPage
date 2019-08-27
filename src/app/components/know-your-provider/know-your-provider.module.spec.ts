import { KnowYourProviderModule } from './know-your-provider.module';

describe('KnowYourProviderModule', () => {
  let knowYourProviderModule: KnowYourProviderModule;

  beforeEach(() => {
    knowYourProviderModule = new KnowYourProviderModule();
  });

  it('should create an instance', () => {
    expect(knowYourProviderModule).toBeTruthy();
  });
});
