import { IssueSeverity, IssueType } from '@prisma/client';

import type { AnalyzerRule, CodeIssue } from '../types';

export class LongParameterListRule implements AnalyzerRule {
  private readonly MAX_PARAMETERS = 5;

  analyze(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    const functionPattern = /(?:function\s+(\w+)|(\w+)\s*=\s*(?:async\s*)?\()\s*([^)]*)\)/;

    lines.forEach((line, index) => {
      const match = line.match(functionPattern);
      if (!match) return;

      const functionName = match[1] || match[2] || 'anonymous';
      const params = match[3];

      if (!params.trim()) return;

      const paramList = params
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p && !p.startsWith('{'));

      const paramCount = paramList.length;

      if (paramCount > this.MAX_PARAMETERS) {
        issues.push({
          type: IssueType.LONG_PARAMETER_LIST,
          severity: paramCount > 8 ? IssueSeverity.HIGH : IssueSeverity.MEDIUM,
          message: `Function "${functionName}" has ${paramCount} parameters (limit: ${this.MAX_PARAMETERS})`,
          filePath,
          lineStart: index + 1,
          lineEnd: index + 1,
          suggestion:
            'Consider using an options object to group related parameters or apply the Parameter Object pattern.',
          codeSnippet: line.trim(),
        });
      }
    });

    return issues;
  }
}
