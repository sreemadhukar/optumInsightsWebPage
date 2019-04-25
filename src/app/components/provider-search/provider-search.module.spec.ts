import { ProviderSearchModule } from './provider-search.module';

describe('ProviderSearchModule', () => {
  let providerSearchModule: ProviderSearchModule;

  beforeEach(() => {
    providerSearchModule = new ProviderSearchModule();
  });

  it('should create an instance', () => {
    expect(providerSearchModule).toBeTruthy();
  });
});
