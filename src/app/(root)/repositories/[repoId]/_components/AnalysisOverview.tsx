import { Code } from 'lucide-react';

import { fetchAnalyzes } from '@/app/(root)/repositories/[repoId]/_actions/fetch-analyzes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/card';

import { AnalysisList } from './AnalysisList';
import { StartAnalysisButton } from './StartAnalysisButton';

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

export async function AnalysisOverview({ repo }: AnalysisOverviewProps) {
  const analyses = await fetchAnalyzes(repo.id);

  return (
    <div className="flex flex-col gap-6">
      {analyses.length > 0 ? (
        <AnalysisList analyses={analyses} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Overview</CardTitle>
            <CardDescription>
              Run an analysis to see code quality metrics and insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <Code className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Analysis Yet</h3>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Start your first analysis to identify technical debt, complexity issues, and code
              quality improvements.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <StartAnalysisButton
          repoId={repo.id}
          owner={repo.owner.login}
          repoName={repo.name}
          defaultBranch={repo.default_branch}
        />
      </div>
    </div>
  );
}
