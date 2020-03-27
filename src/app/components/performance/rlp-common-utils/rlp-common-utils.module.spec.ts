import { RlpCommonUtilsModule } from './rlp-common-utils.module';

describe('RlpCommonUtilsModule', () => {
  let rlpCommonUtilsModule: RlpCommonUtilsModule;

  beforeEach(() => {
    rlpCommonUtilsModule = new RlpCommonUtilsModule();
  });

  it('should create an instance', () => {
    expect(rlpCommonUtilsModule).toBeTruthy();
  });
});
