import { IssueSeverity, IssueType } from '@prisma/client';

import { calculateScore, type ScoreInput } from '../score';

describe('calculateScore', () => {
  it('should return 100 for empty code (0 lines)', () => {
    const input: ScoreInput = {
      totalIssues: 0,
      totalLines: 0,
      totalFiles: 0,
      issues: [],
    };

    expect(calculateScore(input)).toBe(100);
  });

  it('should return 100 for code with no issues', () => {
    const input: ScoreInput = {
      totalIssues: 0,
      totalLines: 100,
      totalFiles: 5,
      issues: [],
    };

    expect(calculateScore(input)).toBe(100);
  });

  it('should calculate score correctly for low severity issues', () => {
    const input: ScoreInput = {
      totalIssues: 1,
      totalLines: 100,
      totalFiles: 1,
      issues: [
        {
          type: IssueType.MAGIC_NUMBER,
          severity: IssueSeverity.LOW,
          message: 'Magic number detected',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 1,
        },
      ],
    };

    const score = calculateScore(input);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThan(0);
  });

  it('should calculate score correctly for high severity issues', () => {
    const input: ScoreInput = {
      totalIssues: 1,
      totalLines: 100,
      totalFiles: 1,
      issues: [
        {
          type: IssueType.LONG_FUNCTION,
          severity: IssueSeverity.HIGH,
          message: 'Function is too long',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 100,
        },
      ],
    };

    const score = calculateScore(input);
    expect(score).toBeLessThan(100);
    expect(score).toBeLessThan(95);
  });

  it('should calculate score correctly for critical severity issues', () => {
    const input: ScoreInput = {
      totalIssues: 1,
      totalLines: 100,
      totalFiles: 1,
      issues: [
        {
          type: IssueType.GOD_CLASS,
          severity: IssueSeverity.CRITICAL,
          message: 'Class is too large',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 500,
        },
      ],
    };

    const score = calculateScore(input);
    expect(score).toBeLessThan(100);
    expect(score).toBeLessThan(90);
  });

  it('should apply type multipliers correctly', () => {
    const input: ScoreInput = {
      totalIssues: 2,
      totalLines: 100,
      totalFiles: 1,
      issues: [
        {
          type: IssueType.GOD_CLASS,
          severity: IssueSeverity.MEDIUM,
          message: 'God class',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 1,
        },
        {
          type: IssueType.MAGIC_NUMBER,
          severity: IssueSeverity.MEDIUM,
          message: 'Magic number',
          filePath: 'test.ts',
          lineStart: 2,
          lineEnd: 2,
        },
      ],
    };

    const score = calculateScore(input);
    expect(score).toBeLessThan(100);
  });

  it('should handle multiple issues correctly', () => {
    const input: ScoreInput = {
      totalIssues: 5,
      totalLines: 200,
      totalFiles: 2,
      issues: [
        {
          type: IssueType.MAGIC_NUMBER,
          severity: IssueSeverity.LOW,
          message: 'Magic number 1',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 1,
        },
        {
          type: IssueType.MAGIC_NUMBER,
          severity: IssueSeverity.LOW,
          message: 'Magic number 2',
          filePath: 'test.ts',
          lineStart: 2,
          lineEnd: 2,
        },
        {
          type: IssueType.LONG_FUNCTION,
          severity: IssueSeverity.MEDIUM,
          message: 'Long function',
          filePath: 'test.ts',
          lineStart: 10,
          lineEnd: 60,
        },
        {
          type: IssueType.LARGE_FILE,
          severity: IssueSeverity.LOW,
          message: 'Large file',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 500,
        },
        {
          type: IssueType.GOD_CLASS,
          severity: IssueSeverity.HIGH,
          message: 'God class',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 400,
        },
      ],
    };

    const score = calculateScore(input);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should return rounded score to 1 decimal place', () => {
    const input: ScoreInput = {
      totalIssues: 1,
      totalLines: 50,
      totalFiles: 1,
      issues: [
        {
          type: IssueType.MAGIC_NUMBER,
          severity: IssueSeverity.LOW,
          message: 'Magic number',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 1,
        },
      ],
    };

    const score = calculateScore(input);
    expect(score.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(1);
  });

  it('should handle very small files (less than 50 lines) with minimum denominator', () => {
    const input: ScoreInput = {
      totalIssues: 1,
      totalLines: 10,
      totalFiles: 1,
      issues: [
        {
          type: IssueType.MAGIC_NUMBER,
          severity: IssueSeverity.LOW,
          message: 'Magic number',
          filePath: 'test.ts',
          lineStart: 1,
          lineEnd: 1,
        },
      ],
    };

    const score = calculateScore(input);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should never return negative score', () => {
    const input: ScoreInput = {
      totalIssues: 100,
      totalLines: 100,
      totalFiles: 1,
      issues: Array(100)
        .fill(null)
        .map((_, i) => ({
          type: IssueType.GOD_CLASS,
          severity: IssueSeverity.CRITICAL,
          message: `Issue ${i}`,
          filePath: 'test.ts',
          lineStart: i + 1,
          lineEnd: i + 1,
        })),
    };

    const score = calculateScore(input);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
