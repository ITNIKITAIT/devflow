'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, File, FileCode, FileJson, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { fetchFileContent } from '@/app/(root)/repositories/[repoId]/_actions/fetch-file-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  files: Array<{
    path: string;
    mode: string;
    type: string;
    sha: string;
    size?: number;
    url?: string;
  }>;
  owner: string;
  repoName: string;
}

interface FileItemProps {
  file: FileTreeProps['files'][0];
  owner: string;
  repoName: string;
}

function FileItem({ file, owner, repoName }: FileItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['file-content', owner, repoName, file.path],
    queryFn: async () => await fetchFileContent(owner, repoName, file.path),
    enabled: isExpanded,
  });

  const getFileIcon = (path: string) => {
    if (path.endsWith('.json')) {
      return <FileJson className="h-4 w-4 text-orange-500 shrink-0" />;
    }
    if (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js')) {
      return <FileCode className="h-4 w-4 text-blue-500 shrink-0" />;
    }
    return <File className="h-4 w-4 text-muted-foreground shrink-0" />;
  };

  return (
    <div className="border-b border-border/50 last:border-0">
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-2 hover:bg-muted/50 transition-colors cursor-pointer select-none',
          isExpanded && 'bg-muted/30'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isLoading && isExpanded ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
        ) : isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}

        {getFileIcon(file.path)}
        <span className="font-mono text-xs truncate">{file.path}</span>
      </div>

      {isExpanded && !isLoading && data && (
        <div className="bg-muted/30 border-t border-border/50">
          <pre className="p-4 overflow-x-auto text-xs font-mono">
            <code>{data}</code>
          </pre>
        </div>
      )}
      {isExpanded && !isLoading && !data && (
        <div className="bg-muted/30 border-t border-border/50 p-4 text-xs text-red-500">
          Failed to load content or empty file.
        </div>
      )}
    </div>
  );
}

export function FileTree({ files, owner, repoName }: FileTreeProps) {
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Source Code</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="flex flex-col text-sm">
          {sortedFiles.map((file) => (
            <FileItem key={file.sha} file={file} owner={owner} repoName={repoName} />
          ))}
          {sortedFiles.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No source files found to analyze.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
