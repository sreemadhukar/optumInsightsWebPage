import { HeadMaterialModule } from './head.material.module';

describe('CommonUtilsModule', () => {
  let headMaterialModule: HeadMaterialModule;

  beforeEach(() => {
    headMaterialModule = new HeadMaterialModule();
  });

  it('should create an instance', () => {
    expect(headMaterialModule).toBeTruthy();
  });
});
