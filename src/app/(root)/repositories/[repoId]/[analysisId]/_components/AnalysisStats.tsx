import type { Analysis } from '@prisma/client';
import { FileCode, GitBranch, GitCommit, TrendingDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';

interface AnalysisStatsProps {
  analysis: Analysis;
}

export function AnalysisStats({ analysis }: AnalysisStatsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Tech Debt Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`rounded-lg border p-6 text-center ${getScoreBgColor(analysis.techDebtScore)}`}
          >
            <div className={`text-4xl font-bold ${getScoreColor(analysis.techDebtScore)}`}>
              {analysis.techDebtScore.toFixed(1)}%
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Overall code quality score</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            File Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Analyzed Files</span>
            <span className="font-semibold">{analysis.analyzedFiles}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Lines</span>
            <span className="font-semibold">{analysis.totalLines.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-4 w-4" />
            Commit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <GitCommit className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">
              {analysis.commitSha.substring(0, 7)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{analysis.branch}</span>
          </div>
        </CardContent>
      </Card>
      {analysis.completedAt && (
        <span className="text-xs">
          Analysis completed at: {new Date(analysis.completedAt).toLocaleString()}
        </span>
      )}
    </div>
  );
}
