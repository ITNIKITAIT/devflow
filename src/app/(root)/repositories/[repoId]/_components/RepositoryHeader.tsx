'use client';

import { GitBranch, Lock, Star, Eye, Unlock } from 'lucide-react';

import { Badge } from '@/components/shared/badge';

interface RepositoryHeaderProps {
  repo: {
    name: string;
    private: boolean;
    description: string | null;
    language: string | null;
    default_branch: string;
    stargazers_count: number;
    watchers_count: number;
  };
}

export function RepositoryHeader({ repo }: RepositoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{repo.name}</h1>
          <Badge variant={repo.private ? 'secondary' : 'outline'} className="h-6 gap-1">
            {repo.private ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            {repo.private ? 'Private' : 'Public'}
          </Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          {repo.description || 'No description provided'}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-primary" />
              {repo.language}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-4 w-4" />
            {repo.default_branch}
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4" />
            {repo.stargazers_count} stars
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {repo.watchers_count} watchers
          </div>
        </div>
      </div>
    </div>
  );
}
