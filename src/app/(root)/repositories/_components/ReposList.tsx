import Link from 'next/link';

import { getGitHubClient } from '@/lib/github/client';

export default async function ReposList() {
  const client = await getGitHubClient();
  const repos = await client.getUserRepositories();

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Your Repositories</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <div key={repo.githubId} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">
              <Link
                href={'/repositories/' + repo.githubId}
                className="text-blue-600 hover:underline"
              >
                {repo.name}
              </Link>
            </h3>
            {repo.description && <p className="text-gray-600 mb-2">{repo.description}</p>}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {repo.language && <span>{repo.language}</span>}
              {repo.isPrivate && <span className="text-orange-500">Private</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
