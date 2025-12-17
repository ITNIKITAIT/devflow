import { IssueSeverity, IssueType } from '@prisma/client';

import type { CodeIssue } from './types';

export interface ScoreInput {
  totalIssues: number;
  totalLines: number;
  totalFiles: number;
  issues: CodeIssue[];
}

const SEVERITY_WEIGHTS = {
  [IssueSeverity.CRITICAL]: 15,
  [IssueSeverity.HIGH]: 8,
  [IssueSeverity.MEDIUM]: 4,
  [IssueSeverity.LOW]: 1,
  [IssueSeverity.INFO]: 0.1,
};

const TYPE_WEIGHTS = {
  [IssueType.GOD_CLASS]: 1.5,
  [IssueType.CIRCULAR_DEPENDENCY]: 1.5,
  [IssueType.DEEP_NESTING]: 1.2,
  [IssueType.COMPLEXITY]: 1.2,
  [IssueType.LONG_FUNCTION]: 1.1,
  [IssueType.MAGIC_NUMBER]: 1.0,
  [IssueType.DUPLICATE]: 1.0,
  [IssueType.DEAD_CODE]: 0.8,
  [IssueType.LONG_PARAMETER_LIST]: 1.0,
  [IssueType.LARGE_FILE]: 1.0,
};

export function calculateScore(input: ScoreInput): number {
  const { totalLines, issues } = input;

  if (totalLines === 0) {
    return 100;
  }

  let totalPenalty = 0;

  issues.forEach((issue) => {
    const severityWeight = SEVERITY_WEIGHTS[issue.severity];
    const typeMultiplier = TYPE_WEIGHTS[issue.type] || 1;

    totalPenalty += severityWeight * typeMultiplier;
  });

  const penaltyPerLine = totalPenalty / Math.max(totalLines, 50);

  const score = Math.max(0, 100 - penaltyPerLine * 100);

  return Math.round(score * 10) / 10;
}
