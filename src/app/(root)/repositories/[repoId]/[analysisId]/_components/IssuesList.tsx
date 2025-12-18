import type { Issue } from '@prisma/client';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

import { Badge } from '@/components/shared/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/table';

interface IssuesListProps {
  issues: Issue[];
}

export function IssuesList({ issues }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-sm text-muted-foreground">No issues found!</p>
            <p className="text-xs text-muted-foreground mt-1">Your code looks great.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityIcon = (severity: Issue['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'HIGH':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'LOW':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadgeVariant = (severity: Issue['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive' as const;
      case 'HIGH':
        return 'destructive' as const;
      case 'MEDIUM':
        return 'outline' as const;
      case 'LOW':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const formatIssueType = (type: Issue['type']) => {
    return type
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues ({issues.length})</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead className="w-[150px]">Type</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="w-[100px]">Lines</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(issue.severity)}
                    <Badge variant={getSeverityBadgeVariant(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium">{formatIssueType(issue.type)}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs">{issue.filePath}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground">
                    {issue.lineStart}
                    {issue.lineEnd !== issue.lineStart ? `-${issue.lineEnd}` : ''}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-xs">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-xs text-muted-foreground">💡 {issue.suggestion}</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
