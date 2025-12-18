import { IssueSeverity, IssueType } from '@prisma/client';

import { LargeFileRule } from '../large-file';

describe('LargeFileRule', () => {
  let rule: LargeFileRule;

  beforeEach(() => {
    rule = new LargeFileRule();
  });

  it('should not detect issues for small files', () => {
    const content = Array(100).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should not detect issues for files at the limit (500 lines)', () => {
    const content = Array(500).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should detect large files over 500 lines', () => {
    const content = Array(600).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues.length).toBe(1);
    expect(issues[0].type).toBe(IssueType.LARGE_FILE);
  });

  it('should assign LOW severity for files between 500-750 lines', () => {
    const content = Array(600).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.LOW);
  });

  it('should assign MEDIUM severity for files between 750-1000 lines', () => {
    const content = Array(800).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.MEDIUM);
  });

  it('should assign HIGH severity for files over 1000 lines', () => {
    const content = Array(1200).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.HIGH);
  });

  it('should provide correct line range (entire file)', () => {
    const content = Array(600).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].lineStart).toBe(1);
    expect(issues[0].lineEnd).toBe(600);
  });

  it('should include correct line count in message', () => {
    const content = Array(600).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].message).toContain('600');
    expect(issues[0].message).toContain('500');
  });

  it('should include suggestion in issue', () => {
    const content = Array(600).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].suggestion).toBeDefined();
    expect(issues[0].suggestion).toContain('splitting');
  });

  it('should handle empty files', () => {
    const issues = rule.analyze('', 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should handle files with only newlines', () => {
    const content = '\n\n\n';
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should return exactly one issue for large files', () => {
    const content = Array(1000).fill('const line = "code";').join('\n');
    const issues = rule.analyze(content, 'test.ts');
    expect(issues.length).toBe(1);
  });
});
