'use server';

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function fetchAnalysis(analysisId: string) {
  const session = await requireAuth();
  const userId = session.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }
  const analysis = await prisma.analysis.findUnique({
    where: {
      id: analysisId,
      userId: userId,
    },
    include: {
      issues: true,
    },
  });

  return analysis;
}
