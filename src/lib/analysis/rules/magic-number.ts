import { IssueSeverity, IssueType } from '@prisma/client';

import type { AnalyzerRule, CodeIssue } from '../types';

export class MagicNumberRule implements AnalyzerRule {
  analyze(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    const magicNumberRegex = /(?<![\w])(\d+)(?![\w])/g;

    lines.forEach((line, index) => {
      if (
        line.trim().startsWith('//') ||
        line.trim().startsWith('/*') ||
        line.trim().startsWith('*')
      ) {
        return;
      }

      let match;
      while ((match = magicNumberRegex.exec(line)) !== null) {
        const number = parseInt(match[0], 10);

        if (number === 0 || number === 1 || number === -1) {
          continue;
        }

        if (line.includes('const ') && line.includes(match[0])) {
          continue;
        }

        issues.push({
          type: IssueType.MAGIC_NUMBER,
          severity: IssueSeverity.LOW,
          message: `Magic number detected: ${number}`,
          filePath,
          lineStart: index + 1,
          lineEnd: index + 1,
          suggestion: 'Consider assigning this number to a named constant.',
          codeSnippet: line.trim(),
        });
      }
    });

    return issues;
  }
}
