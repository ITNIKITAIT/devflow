'use server';

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function fetchAnalyzes(repoId: number) {
  const session = await requireAuth();
  const userId = session.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }
  const analyses = await prisma.analysis.findMany({
    where: {
      repositoryId: repoId,
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return analyses;
}
