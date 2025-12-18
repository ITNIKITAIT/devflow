import { IssueSeverity, IssueType } from '@prisma/client';

import type { AnalyzerRule, CodeIssue } from '../types';

export class LargeFileRule implements AnalyzerRule {
  private readonly MAX_LINES = 500;

  analyze(content: string, filePath: string): CodeIssue[] {
    const lines = content.split('\n');
    const lineCount = lines.length;

    if (lineCount <= this.MAX_LINES) {
      return [];
    }

    const severity =
      lineCount > 1000
        ? IssueSeverity.HIGH
        : lineCount > 750
          ? IssueSeverity.MEDIUM
          : IssueSeverity.LOW;

    return [
      {
        type: IssueType.LARGE_FILE,
        severity,
        message: `File is too large (${lineCount} lines, limit: ${this.MAX_LINES})`,
        filePath,
        lineStart: 1,
        lineEnd: lineCount,
        suggestion:
          'Consider splitting this file into multiple smaller modules, each with a single responsibility.',
      },
    ];
  }
}
