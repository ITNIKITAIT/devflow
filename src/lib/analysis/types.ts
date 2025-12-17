import type { IssueSeverity, IssueType } from '@prisma/client';

export interface CodeIssue {
  type: IssueType;
  severity: IssueSeverity;
  message: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  suggestion?: string;
  codeSnippet?: string;
}

export interface AnalyzerRule {
  analyze(content: string, filePath: string): CodeIssue[];
}
