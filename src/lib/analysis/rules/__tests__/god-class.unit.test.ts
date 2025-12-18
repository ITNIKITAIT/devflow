import { IssueSeverity, IssueType } from '@prisma/client';

import { GodClassRule } from '../god-class';

describe('GodClassRule', () => {
  let rule: GodClassRule;

  beforeEach(() => {
    rule = new GodClassRule();
  });

  it('should not detect issues for small classes', () => {
    const content = `
      class SmallClass {
        method1() {}
        method2() {}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should not detect issues for classes at the limit (300 lines)', () => {
    const content = `
      class MediumClass {
${Array(298).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues).toEqual([]);
  });

  it('should detect large classes over 300 lines', () => {
    const content = `
      class LargeClass {
${Array(350).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues.length).toBe(1);
    expect(issues[0].type).toBe(IssueType.GOD_CLASS);
  });

  it('should assign MEDIUM severity for classes between 300-400 lines', () => {
    const content = `
      class MediumLargeClass {
${Array(350).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.MEDIUM);
  });

  it('should assign HIGH severity for classes between 400-500 lines', () => {
    const content = `
      class VeryLargeClass {
${Array(450).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.HIGH);
  });

  it('should assign CRITICAL severity for classes over 500 lines', () => {
    const content = `
      class HugeClass {
${Array(600).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].severity).toBe(IssueSeverity.CRITICAL);
  });

  it('should provide correct class name in message', () => {
    const content = `
      class MyLargeClass {
${Array(350).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].message).toContain('MyLargeClass');
  });

  it('should provide correct line range', () => {
    const content = `
      class TestClass {
${Array(350).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].lineStart).toBe(2);
    expect(issues[0].lineEnd).toBeGreaterThan(300);
  });

  it('should include suggestion in issue', () => {
    const content = `
      class LargeClass {
${Array(350).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues[0].suggestion).toBeDefined();
    expect(issues[0].suggestion).toContain('Single Responsibility');
  });

  it('should handle multiple classes in one file', () => {
    const content = `
      class SmallClass {
        method() {}
      }
      
      class LargeClass {
${Array(350).fill('        method() {}').join('\n')}
      }
      
      class AnotherSmallClass {
        method() {}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    // Should only detect the large class
    expect(issues.length).toBe(1);
    expect(issues[0].message).toContain('LargeClass');
  });

  it('should handle nested classes correctly', () => {
    const content = `
      class OuterClass {
        class InnerClass {
${Array(350).fill('          method() {}').join('\n')}
        }
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    // Should detect the inner class if it's large enough
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should handle classes with complex structure', () => {
    const content = `
      class ComplexClass {
        private prop1: string;
        private prop2: number;
        
        constructor() {
          this.prop1 = '';
          this.prop2 = 0;
        }
        
${Array(340).fill('        method() {}').join('\n')}
      }
    `;
    const issues = rule.analyze(content, 'test.ts');
    expect(issues.length).toBe(1);
  });
});
