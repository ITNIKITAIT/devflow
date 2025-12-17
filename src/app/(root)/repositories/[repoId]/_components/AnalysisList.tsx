import type { Analysis, AnalysisStatus } from '@prisma/client';
import { AlertCircle, CheckCircle2, Clock, Eye, GitCommit, XCircle } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/table';

export function AnalysisList({ analyses }: { analyses: Analysis[] }) {
  const getStatusIcon = (status: AnalysisStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'RUNNING':
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Analysis History</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commit</TableHead>
              <TableHead>Issues</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyses.map((analysis) => (
              <TableRow key={analysis.id} className="hover:bg-muted/50 cursor-pointer">
                <TableCell className="font-medium text-xs text-muted-foreground">
                  {new Date(analysis.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(analysis.status)}
                    <span className="text-xs font-medium capitalize">
                      {analysis.status.toLowerCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                    <GitCommit className="h-3 w-3" />
                    <span>{analysis.commitSha.substring(0, 7)}</span>
                  </div>
                </TableCell>
                <TableCell>{analysis.totalIssues}</TableCell>
                <TableCell>
                  <span className={`font-bold ${getScoreColor(analysis.techDebtScore)}`}>
                    {analysis.techDebtScore}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" className="gap-2 cursor-pointer">
                    <Eye className="h-4 w-4" /> View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
