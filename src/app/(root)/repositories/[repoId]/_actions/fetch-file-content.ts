'use server';

import { getGitHubClient } from '@/lib/github/client';

export async function fetchFileContent(owner: string, repo: string, path: string) {
  try {
    const client = await getGitHubClient();
    return await client.getFileContent(owner, repo, path);
  } catch (error) {
    throw new Error('Failed to fetch file content', { cause: error });
  }
}
