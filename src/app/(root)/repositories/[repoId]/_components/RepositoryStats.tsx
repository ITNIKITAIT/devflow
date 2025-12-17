'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Separator } from '@/components/shared/separator';

interface RepositoryStatsProps {
  repo: {
    default_branch: string;
    forks_count: number;
    open_issues_count: number;
    size: number;
  };
}

export function RepositoryStats({ repo }: RepositoryStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Default Branch</span>
          <span className="text-sm font-medium">{repo.default_branch}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Forks</span>
          <span className="text-sm font-medium">{repo.forks_count}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Open Issues</span>
          <span className="text-sm font-medium">{repo.open_issues_count}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Size</span>
          <span className="text-sm font-medium">{(repo.size / 1024).toFixed(2)} MB</span>
        </div>
      </CardContent>
    </Card>
  );
}
