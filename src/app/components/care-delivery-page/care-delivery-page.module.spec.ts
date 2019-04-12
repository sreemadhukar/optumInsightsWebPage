import { CareDeliveryPageModule } from './care-delivery-page.module';

describe('CareDeliveryPageModule', () => {
  let careDeliveryPageModule: CareDeliveryPageModule;

  beforeEach(() => {
    careDeliveryPageModule = new CareDeliveryPageModule();
  });

  it('should create an instance', () => {
    expect(careDeliveryPageModule).toBeTruthy();
  });
});
