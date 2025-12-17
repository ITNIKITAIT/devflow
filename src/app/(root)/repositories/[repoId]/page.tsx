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
  console.log('Repository:', repo);
  if (!repo) {
    notFound();
  }

  const repoTree = await client.getRepositoryTree(repo.data.owner.login, repo.data.name, 'dev');
  const fileContent = await client.getFileContent(
    repo.data.owner.login,
    repo.data.name,
    repoTree[0].path
  );
  console.log('Repository Tree:', repoTree);
  console.log('File Content:', fileContent);

  return <></>;
}
