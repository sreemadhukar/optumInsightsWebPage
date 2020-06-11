import { SummaryTrendsModule } from './summary-trends.module';

describe('SummaryTrendsModule', () => {
  let summaryTrendsModule: SummaryTrendsModule;

  beforeEach(() => {
    summaryTrendsModule = new SummaryTrendsModule();
  });

  it('should create an instance', () => {
    expect(summaryTrendsModule).toBeTruthy();
  });
});
