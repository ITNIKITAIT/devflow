import { notFound } from 'next/navigation';

import { Separator } from '@/components/shared/separator';
import { getGitHubClient } from '@/lib/github/client';

import { AnalysisOverview } from './_components/AnalysisOverview';
import { FileTree } from './_components/FileTree';
import { RepositoryHeader } from './_components/RepositoryHeader';
import { RepositoryStats } from './_components/RepositoryStats';

interface PageProps {
  params: Promise<{
    repoId: string;
  }>;
}

export default async function RepositoryPage({ params }: PageProps) {
  const repoId = parseInt((await params).repoId, 10);
  if (isNaN(repoId)) {
    notFound();
  }

  const client = await getGitHubClient();
  const response = await client.getRepositoryById(repoId);

  if (!response) {
    notFound();
  }

  const repo = response.data;

  const latestCommitSha = await client.getLatestCommit(
    repo.owner.login,
    repo.name,
    repo.default_branch
  );

  const repoTree = await client.getRepositoryTree(repo.owner.login, repo.name, latestCommitSha);

  return (
    <div className="space-y-8 py-8">
      <RepositoryHeader repo={repo} />

      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <AnalysisOverview repo={repo} />
          <FileTree files={repoTree} owner={repo.owner.login} repoName={repo.name} />
        </div>

        <div className="space-y-6">
          <RepositoryStats repo={repo} />
        </div>
      </div>
    </div>
  );
}
