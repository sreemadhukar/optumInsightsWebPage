import { ZeroValueFormatterPipe } from './zero-value-formatter.pipe';

describe('ZeroValueFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new ZeroValueFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
