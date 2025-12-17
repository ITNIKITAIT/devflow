'use client';

import { useMutation } from '@tanstack/react-query';
import { Code, Loader2, Play } from 'lucide-react';

import { analyzeRepository } from '@/app/(root)/repositories/[repoId]/_actions/analyze';
import { Button } from '@/components/shared/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/card';

interface AnalysisOverviewProps {
  repo: {
    id: number;
    owner: { login: string };
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    default_branch: string;
    private: boolean;
  };
}

export function AnalysisOverview({ repo }: AnalysisOverviewProps) {
  const { mutate: startAnalysis, isPending } = useMutation({
    mutationFn: async () => {
      const result = await analyzeRepository(
        repo.id,
        repo.owner.login,
        repo.name,
        repo.default_branch
      );
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
  });

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
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => startAnalysis()}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isPending ? 'Analyzing...' : 'Start Analysis'}
        </Button>
      </CardContent>
    </Card>
  );
}
