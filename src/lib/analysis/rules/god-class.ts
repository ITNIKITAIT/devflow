import { IssueSeverity, IssueType } from '@prisma/client';

import type { AnalyzerRule, CodeIssue } from '../types';

export class GodClassRule implements AnalyzerRule {
  private readonly MAX_LINES = 300;

  analyze(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    const classPattern = /class\s+(\w+)/;
    let currentClassName = '';
    let classStart = -1;
    let braceBalance = 0;
    let inClass = false;

    lines.forEach((line, index) => {
      const match = line.match(classPattern);

      if (match && !inClass) {
        inClass = true;
        currentClassName = match[1];
        classStart = index + 1;
        braceBalance = 0;
      }

      if (inClass) {
        braceBalance += (line.match(/\{/g) || []).length;
        braceBalance -= (line.match(/\}/g) || []).length;

        if (braceBalance <= 0 && classStart !== -1) {
          const classLength = index + 1 - classStart;

          if (classLength > this.MAX_LINES) {
            const severity =
              classLength > 500
                ? IssueSeverity.CRITICAL
                : classLength > 400
                  ? IssueSeverity.HIGH
                  : IssueSeverity.MEDIUM;

            issues.push({
              type: IssueType.GOD_CLASS,
              severity,
              message: `Class "${currentClassName}" is too large (${classLength} lines, limit: ${this.MAX_LINES})`,
              filePath,
              lineStart: classStart,
              lineEnd: index + 1,
              suggestion:
                'Split this class into smaller, focused classes following Single Responsibility Principle.',
              codeSnippet: lines[classStart - 1].trim(),
            });
          }

          inClass = false;
        }
      }
    });

    return issues;
  }
}
