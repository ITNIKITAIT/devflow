import { IssueSeverity, IssueType } from '@prisma/client';

import type { AnalyzerRule, CodeIssue } from '../types';

export class LongFunctionRule implements AnalyzerRule {
  private maxLines = 30;

  analyze(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');
    let currentFunctionStart = -1;
    let braceBalance = 0;
    let inFunction = false;

    // Regex to detect function declarations (simplified)
    const functionRegex =
      /function\s+\w+|\w+\s*=\s*(\(.*?\)|async\s*\(.*?\))\s*=>|\w+\s*\([^)]*\)\s*\{/;

    lines.forEach((line, index) => {
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;

      if (!inFunction && functionRegex.test(line) && openBraces > 0) {
        inFunction = true;
        currentFunctionStart = index + 1;
        braceBalance = 0;
      }

      if (inFunction) {
        braceBalance += openBraces;
        braceBalance -= closeBraces;

        if (braceBalance <= 0 && currentFunctionStart !== -1) {
          const functionLength = index + 1 - currentFunctionStart;

          if (functionLength > this.maxLines) {
            issues.push({
              type: IssueType.LONG_FUNCTION,
              severity: IssueSeverity.MEDIUM,
              message: `Function is too long (${functionLength} lines)`,
              filePath,
              lineStart: currentFunctionStart,
              lineEnd: index + 1,
              suggestion: `Consider breaking this function into smaller, more focused functions. Limit is ${this.maxLines} lines.`,
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
