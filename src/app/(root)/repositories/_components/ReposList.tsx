'use server';
import { Code, GitBranch, Lock, Unlock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/shared/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shared/card';
import { getGitHubClient } from '@/lib/github/client';

export default async function ReposList() {
  const client = await getGitHubClient();
  const repos = await client.getUserRepositories();

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Repositories</h2>
          <p className="text-muted-foreground mt-1">Manage and view your GitHub repositories</p>
        </div>
        <Badge variant="secondary" className="px-4 py-1.5 text-sm h-auto">
          {repos.length} Repositories
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <Card
            key={repo.githubId}
            className="group transition-all hover:shadow-md hover:border-primary/50 flex flex-col justify-between relative"
          >
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${repo.isPrivate ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}
                  >
                    {repo.isPrivate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </div>
                  <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                    <Link
                      href={'/repositories/' + repo.githubId}
                      className="hover:underline focus:outline-none"
                    >
                      {repo.name}
                    </Link>
                  </CardTitle>
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground z-10 p-1"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2 h-10">
                {repo.description || 'No description provided'}
              </CardDescription>
            </CardContent>

            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-4">
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    <span>{repo.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{repo.defaultBranch}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {repo.isPrivate ? 'Private' : 'Public'}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
