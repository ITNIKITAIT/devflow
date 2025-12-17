import { IssueSeverity, IssueType } from '@prisma/client';

import type { AnalyzerRule, CodeIssue } from '../types';

export class MagicNumberRule implements AnalyzerRule {
  private readonly ALLOWED_NUMBERS = new Set([0, 1, -1, 2, 10, 100, 1000]);

  analyze(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    const magicNumberRegex = /(?<![.\w])(\d+)(?![.\w%])/g;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        return;
      }

      const withoutStrings = line
        .replace(/"[^"]*"/g, '')
        .replace(/'[^']*'/g, '')
        .replace(/`[^`]*`/g, '');

      if (
        /className\s*=/.test(withoutStrings) ||
        /class\s*=/.test(withoutStrings) ||
        /grid-cols-|gap-|p-|m-|w-|h-|text-|space-/.test(withoutStrings)
      ) {
        return;
      }

      if (/^(interface|type|enum)\s/.test(trimmed) || /(:\s*number|:\s*\d+)/.test(withoutStrings)) {
        return;
      }

      if (/const\s+\w+\s*=\s*\d+/.test(withoutStrings)) {
        return;
      }

      if (/\[\d+\]/.test(withoutStrings) || /\.slice\(|\.substring\(/.test(withoutStrings)) {
        return;
      }

      let match;
      while ((match = magicNumberRegex.exec(withoutStrings)) !== null) {
        const number = parseInt(match[0], 10);

        if (this.ALLOWED_NUMBERS.has(number)) {
          continue;
        }

        if (number >= 3000 && number <= 9999) {
          continue;
        }

        issues.push({
          type: IssueType.MAGIC_NUMBER,
          severity: IssueSeverity.LOW,
          message: `Magic number detected: ${number}`,
          filePath,
          lineStart: index + 1,
          lineEnd: index + 1,
          suggestion: 'Consider defining this as a named constant (e.g., const MAX_RETRIES = 3)',
          codeSnippet: line.trim(),
        });
      }
    });

    return issues;
  }
}
