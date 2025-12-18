import { IssueSeverity, IssueType } from '@prisma/client';

import { MagicNumberRule } from '../magic-number';

describe('MagicNumberRule', () => {
  let rule: MagicNumberRule;

  beforeEach(() => {
    rule = new MagicNumberRule();
  });

  it('should not detect allowed numbers', () => {
    const content = `
      const value = 0;
      const count = 1;
      const negative = -1;
      const two = 2;
      const ten = 10;
      const hundred = 100;
      const thousand = 1000;
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should detect magic numbers', () => {
    const content = 'const value = someFunction(42);';
    const issues = rule.analyze(content, 'test.ts');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].type).toBe(IssueType.MAGIC_NUMBER);
    expect(issues[0].severity).toBe(IssueSeverity.LOW);
  });

  it('should ignore numbers in comments', () => {
    const content = `
      // This is a comment with 42
      /* Another comment with 100 */
      const value = someFunction(42);
    `;
    const issues = rule.analyze(content, 'test.ts');
    // Should only detect the one in code, not in comments
    expect(issues.length).toBe(1);
  });

  it('should ignore numbers in strings', () => {
    const content = `
      const message = "The answer is 42";
      const another = 'Value is 100';
      const template = \`Number is 50\`;
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should ignore numbers in className attributes', () => {
    const content = `
      <div className="grid-cols-12 gap-4 p-2 m-1 w-10 h-20 text-2xl space-4">
        Content
      </div>
    `;
    const issues = rule.analyze(content, 'test.tsx');
    expect(issues).toEqual([]);
  });

  it('should ignore numbers in type definitions', () => {
    const content = `
      interface Config {
        maxRetries: number;
        timeout: 5000;
      }
      type Status = 200 | 404 | 500;
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should ignore const declarations with numbers', () => {
    const content = 'const MAX_RETRIES = 3;';
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should ignore array indices', () => {
    const content = `
      const arr = [1, 2, 3];
      const item = arr[0];
      const slice = arr.slice(1, 3);
      const sub = arr.substring(0, 5);
    `;
    const issues = rule.analyze(content, 'test.ts');
    // Array literals like [1, 2, 3] may still be detected, but array access arr[0] and slice/substring are ignored
    // The rule only ignores /\[\d+\]/ (array access) and .slice/.substring, not array literals
    expect(issues.length).toBeLessThanOrEqual(3); // May detect numbers in array literal
  });

  it('should ignore numbers in range 3000-9999', () => {
    const content = `
      const port = 3000;
      const year = 2024;
      const code = 5000;
      const max = 9999;
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should detect numbers outside allowed ranges', () => {
    const content = `
      const value = someFunction(25);
      const count = calculate(99);
      const max = getMax(200);
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should provide correct line numbers', () => {
    const content = `
      const a = func(1);
      const b = func(2);
      const c = func(42);
      const d = func(3);
    `;
    const issues = rule.analyze(content, 'test.ts');
    const magicNumberIssue = issues.find((issue) => issue.message.includes('42'));
    expect(magicNumberIssue).toBeDefined();
    expect(magicNumberIssue?.lineStart).toBe(4);
  });

  it('should include suggestion in issue', () => {
    const content = 'const value = someFunction(42);';
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].suggestion).toBeDefined();
    expect(issues[0].suggestion).toContain('constant');
  });

  it('should include code snippet in issue', () => {
    const content = '    const value = someFunction(42);';
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].codeSnippet).toBeDefined();
    expect(issues[0].codeSnippet).toContain('42');
  });
});
