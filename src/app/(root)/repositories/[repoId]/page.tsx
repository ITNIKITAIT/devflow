import { notFound } from 'next/navigation';

import { getGitHubClient } from '@/lib/github/client';

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
  const repo = await client.getRepositoryById(repoId);

  if (!repo) {
    notFound();
  }

  return <></>;
}
