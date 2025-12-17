'use client';

import { Code, Play } from 'lucide-react';

import { Button } from '@/components/shared/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/card';

export function AnalysisOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Overview</CardTitle>
        <CardDescription>Run an analysis to see code quality metrics and insights.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-secondary p-4">
          <Code className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No Analysis Yet</h3>
        <p className="mb-6 max-w-sm text-muted-foreground">
          Start your first analysis to identify technical debt, complexity issues, and code quality
          improvements.
        </p>
        <Button variant="outline" className="gap-2">
          <Play className="h-4 w-4" />
          Start Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
