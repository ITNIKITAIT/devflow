import { IssueSeverity, IssueType } from '@prisma/client';

import type { AnalyzerRule, CodeIssue } from '../types';

export class LongFunctionRule implements AnalyzerRule {
  private readonly MAX_LINES = 50;

  analyze(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    const functionPatterns = [
      /function\s+(\w+)\s*\(/,
      /(\w+)\s*=\s*function\s*\(/,
      /(\w+)\s*=\s*\([^)]*\)\s*=>/,
      /(\w+)\s*=\s*async\s*\([^)]*\)\s*=>/,
      /async\s+function\s+(\w+)\s*\(/,
      /(\w+)\s*\([^)]*\)\s*\{/,
    ];

    let currentFunctionStart = -1;
    let currentFunctionName = '';
    let braceBalance = 0;
    let inFunction = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (
        !trimmed ||
        trimmed.startsWith('//') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*')
      ) {
        return;
      }

      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;

      if (!inFunction) {
        for (const pattern of functionPatterns) {
          const match = line.match(pattern);
          if (match && openBraces > 0) {
            inFunction = true;
            currentFunctionStart = index + 1;
            currentFunctionName = match[1] || 'anonymous';
            braceBalance = 0;
            break;
          }
        }
      }

      if (inFunction) {
        braceBalance += openBraces;
        braceBalance -= closeBraces;

        if (braceBalance <= 0 && currentFunctionStart !== -1) {
          const functionLength = index + 1 - currentFunctionStart;

          if (functionLength > this.MAX_LINES) {
            const severity =
              functionLength > 100
                ? IssueSeverity.HIGH
                : functionLength > 75
                  ? IssueSeverity.MEDIUM
                  : IssueSeverity.LOW;

            issues.push({
              type: IssueType.LONG_FUNCTION,
              severity,
              message: `Function "${currentFunctionName}" is too long (${functionLength} lines, limit: ${this.MAX_LINES})`,
              filePath,
              lineStart: currentFunctionStart,
              lineEnd: index + 1,
              suggestion:
                'Consider breaking this function into smaller, single-responsibility functions',
              codeSnippet: lines[currentFunctionStart - 1].trim(),
            });
          }

          inFunction = false;
          currentFunctionStart = -1;
          braceBalance = 0;
        }
      }
    });

    return issues;
  }
}
