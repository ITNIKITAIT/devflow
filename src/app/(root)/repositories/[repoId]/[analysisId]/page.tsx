import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/shared/button';

import { fetchAnalysis } from '../_actions/fetch-analysis';

import { AnalysisStats } from './_components/AnalysisStats';
import { IssuesList } from './_components/IssuesList';

interface PageProps {
  params: Promise<{
    repoId: string;
    analysisId: string;
  }>;
}

export default async function AnalysisPage({ params }: PageProps) {
  const { repoId, analysisId } = await params;
  const analysis = await fetchAnalysis(analysisId);

  if (!analysis) notFound();

  return (
    <div className="space-y-8 py-8">
      <Link href={`/repositories/${repoId}`}>
        <Button variant="ghost" className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Repository
        </Button>
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <IssuesList issues={analysis.issues} />
        </div>

        <div className="space-y-6">
          <AnalysisStats analysis={analysis} />
        </div>
      </div>
    </div>
  );
}
