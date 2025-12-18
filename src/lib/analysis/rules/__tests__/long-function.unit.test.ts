import { IssueSeverity, IssueType } from '@prisma/client';

import { LongFunctionRule } from '../long-function';

describe('LongFunctionRule', () => {
  let rule: LongFunctionRule;

  beforeEach(() => {
    rule = new LongFunctionRule();
  });

  it('should not detect issues for short functions', () => {
    const content = `
      function shortFunction() {
        return 42;
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should detect long function declarations', () => {
    const longFunction = `
      function longFunction() {
${Array(60).fill('        console.log("line");').join('\n')}
      }
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].type).toBe(IssueType.LONG_FUNCTION);
    expect(issues[0].message).toContain('longFunction');
  });

  it('should detect long arrow functions', () => {
    const longFunction = `
      const longArrow = () => {
${Array(60).fill('        console.log("line");').join('\n')}
      };
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should detect long async functions', () => {
    const longFunction = `
      async function longAsync() {
${Array(60).fill('        await something();').join('\n')}
      }
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should detect long async arrow functions', () => {
    const longFunction = `
      const longAsync = async () => {
${Array(60).fill('        await something();').join('\n')}
      };
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should assign LOW severity for functions between 50-75 lines', () => {
    const longFunction = `
      function mediumFunction() {
${Array(60).fill('        console.log("line");').join('\n')}
      }
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.LOW);
  });

  it('should assign MEDIUM severity for functions between 75-100 lines', () => {
    const longFunction = `
      function largeFunction() {
${Array(80).fill('        console.log("line");').join('\n')}
      }
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.MEDIUM);
  });

  it('should assign HIGH severity for functions over 100 lines', () => {
    const longFunction = `
      function hugeFunction() {
${Array(110).fill('        console.log("line");').join('\n')}
      }
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.HIGH);
  });

  it('should provide correct line range', () => {
    const longFunction = `
      function testFunction() {
${Array(60).fill('        console.log("line");').join('\n')}
      }
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues[0].lineStart).toBe(2);
    expect(issues[0].lineEnd).toBeGreaterThan(50);
  });

  it('should ignore comments when calculating function length', () => {
    const longFunction = `
      function commentedFunction() {
        // This is a comment
        /* Another comment */
        return 42;
      }
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    // Function is short, should not trigger
    expect(issues).toEqual([]);
  });

  it('should handle nested functions correctly', () => {
    const content = `
      function outerFunction() {
        function innerFunction() {
${Array(60).fill('          console.log("line");').join('\n')}
        }
        return innerFunction();
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    // Should detect the inner function
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should include suggestion in issue', () => {
    const longFunction = `
      function longFunction() {
${Array(60).fill('        console.log("line");').join('\n')}
      }
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues[0].suggestion).toBeDefined();
    expect(issues[0].suggestion).toContain('smaller');
  });

  it('should handle anonymous functions', () => {
    const longFunction = `
      const handler = function() {
${Array(60).fill('        console.log("line");').join('\n')}
      };
    `;
    const issues = rule.analyze(longFunction, 'test.ts');
    expect(issues.length).toBeGreaterThan(0);
    // The rule extracts the variable name "handler" from "const handler = function()"
    expect(issues[0].message).toContain('handler');
  });
});
