import { NetworkManagementModule } from './network-management.module';

describe('NetworkManagementModule', () => {
  let networkManagementModule: NetworkManagementModule;

  beforeEach(() => {
    networkManagementModule = new NetworkManagementModule();
  });

  it('should create an instance', () => {
    expect(networkManagementModule).toBeTruthy();
  });
});
