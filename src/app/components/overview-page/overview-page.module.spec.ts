import { OverviewPageModule } from './overview-page.module';

describe('OverviewPageModule', () => {
  let overviewPageModule: OverviewPageModule;

  beforeEach(() => {
    overviewPageModule = new OverviewPageModule();
  });

  it('should create an instance', () => {
    expect(overviewPageModule).toBeTruthy();
  });
});
