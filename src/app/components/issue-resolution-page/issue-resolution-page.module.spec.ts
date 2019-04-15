import { IssueResolutionPageModule } from './issue-resolution-page.module';

describe('IssueResolutionPageModule', () => {
  let issueResolutionPageModule: IssueResolutionPageModule;

  beforeEach(() => {
    issueResolutionPageModule = new IssueResolutionPageModule();
  });

  it('should create an instance', () => {
    expect(issueResolutionPageModule).toBeTruthy();
  });
});
