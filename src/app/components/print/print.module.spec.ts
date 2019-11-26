import { PrintModule } from './print.module';

describe('PrintModule', () => {
  let printModule: PrintModule;

  beforeEach(() => {
    printModule = new PrintModule();
  });

  it('should create an instance', () => {
    expect(printModule).toBeTruthy();
  });
});
