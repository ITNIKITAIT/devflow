'use client';

import { useMutation } from '@tanstack/react-query';
import { Loader2, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { analyzeRepository } from '@/app/(root)/repositories/[repoId]/_actions/analyze';
import { Button } from '@/components/shared/button';

interface StartAnalysisButtonProps {
  repoId: number;
  owner: string;
  repoName: string;
  defaultBranch: string;
}

export function StartAnalysisButton({
  repoId,
  owner,
  repoName,
  defaultBranch,
}: StartAnalysisButtonProps) {
  const router = useRouter();

  const { mutate: startAnalysis, isPending } = useMutation({
    mutationFn: async () => {
      const result = await analyzeRepository(repoId, owner, repoName, defaultBranch);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={() => startAnalysis()}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
      {isPending ? 'Analyzing...' : 'Start Analysis'}
    </Button>
  );
}
