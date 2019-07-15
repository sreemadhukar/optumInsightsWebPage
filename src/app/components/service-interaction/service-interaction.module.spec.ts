import { ServiceInteractionModule } from './service-interaction.module';

describe('ServiceInteractionModule', () => {
  let serviceInteractionModule: ServiceInteractionModule;

  beforeEach(() => {
    serviceInteractionModule = new ServiceInteractionModule();
  });

  it('should create an instance', () => {
    expect(serviceInteractionModule).toBeTruthy();
  });
});
