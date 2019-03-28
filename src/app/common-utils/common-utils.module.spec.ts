import { CommonUtilsModule } from './common-utils.module';

describe('CommonUtilsModule', () => {
  let commonUtilsModule: CommonUtilsModule;

  beforeEach(() => {
    commonUtilsModule = new CommonUtilsModule();
  });

  it('should create an instance', () => {
    expect(commonUtilsModule).toBeTruthy();
  });
});
