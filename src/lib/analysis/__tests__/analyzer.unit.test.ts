import { CodeAnalyzer } from '../analyzer';

describe('CodeAnalyzer', () => {
  let analyzer: CodeAnalyzer;

  beforeEach(() => {
    analyzer = new CodeAnalyzer();
  });

  it('should return empty array for non-JS/TS files', () => {
    const content = 'some code here';
    const result = analyzer.analyzeFile(content, 'file.txt');
    expect(result).toEqual([]);
  });

  it('should return empty array for .py files', () => {
    const content = 'def hello(): pass';
    const result = analyzer.analyzeFile(content, 'file.py');
    expect(result).toEqual([]);
  });

  it('should analyze .js files', () => {
    const content = 'function test() { return 42; }';
    const result = analyzer.analyzeFile(content, 'file.js');
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should analyze .ts files', () => {
    const content = 'function test(): number { return 42; }';
    const result = analyzer.analyzeFile(content, 'file.ts');
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should analyze .jsx files', () => {
    const content = 'const Component = () => <div>Hello</div>';
    const result = analyzer.analyzeFile(content, 'file.jsx');
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should analyze .tsx files', () => {
    const content = 'const Component: React.FC = () => <div>Hello</div>';
    const result = analyzer.analyzeFile(content, 'file.tsx');
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return empty array for test files', () => {
    const content = 'function test() { return 42; }';
    const result = analyzer.analyzeFile(content, 'file.test.ts');
    expect(result).toEqual([]);
  });

  it('should return empty array for files with "test" in path', () => {
    const content = 'function test() { return 42; }';
    const result = analyzer.analyzeFile(content, 'src/test/file.ts');
    expect(result).toEqual([]);
  });

  it('should apply all rules to valid files', () => {
    const content = `
      class LargeClass {
        ${Array(400).fill('method() { }').join('\n        ')}
      }
    `;
    const result = analyzer.analyzeFile(content, 'file.ts');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should detect multiple types of issues', () => {
    const content = `
      function longFunction() {
        ${Array(60).fill('console.log(123);').join('\n        ')}
      }
      
      function manyParams(a, b, c, d, e, f, g) {
        return a + b + c + d + e + f + g;
      }
    `;
    const result = analyzer.analyzeFile(content, 'file.ts');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle empty files', () => {
    const result = analyzer.analyzeFile('', 'file.ts');
    expect(result).toEqual([]);
  });

  it('should handle files with only comments', () => {
    const content = `
      // This is a comment
      /* Another comment */
    `;
    const result = analyzer.analyzeFile(content, 'file.ts');
    expect(result.length).toBe(0);
  });
});
