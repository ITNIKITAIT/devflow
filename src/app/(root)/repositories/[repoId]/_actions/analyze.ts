'use server';

import { AnalysisStatus } from '@prisma/client';

import { CodeAnalyzer } from '@/lib/analysis/analyzer';
import { calculateScore } from '@/lib/analysis/score';
import type { CodeIssue } from '@/lib/analysis/types';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getGitHubClient } from '@/lib/github/client';

export async function analyzeRepository(
  githubId: number,
  owner: string,
  repoName: string,
  defaultBranch: string
) {
  try {
    const session = await requireAuth();
    const userId = session.user?.id;

    if (!userId) {
      throw new Error('User not found');
    }

    const client = await getGitHubClient();
    const latestCommitSha = await client.getLatestCommit(owner, repoName, defaultBranch);

    const existingAnalysis = await prisma.analysis.findFirst({
      where: {
        repositoryId: githubId,
        userId: userId,
        commitSha: latestCommitSha,
      },
    });

    if (existingAnalysis) {
      throw new Error('Analysis already exists for the latest commit');
    }

    const analysis = await prisma.analysis.create({
      data: {
        repositoryId: githubId,
        userId,
        status: AnalysisStatus.RUNNING,
        startedAt: new Date(),
        commitSha: latestCommitSha,
      },
    });

    const tree = await client.getRepositoryTree(owner, repoName, latestCommitSha);

    const analyzer = new CodeAnalyzer();
    let totalIssues = 0;
    let analyzedFilesCount = 0;
    let totalLines = 0;
    const allIssues: CodeIssue[] = [];

    for (const file of tree) {
      try {
        const content = await client.getFileContent(owner, repoName, file.path);
        totalLines += content.split('\n').length;

        const issues = analyzer.analyzeFile(content, file.path);
        allIssues.push(...issues);

        if (issues.length > 0) {
          totalIssues += issues.length;

          await prisma.issue.createMany({
            data: issues.map((issue) => ({
              analysisId: analysis.id,
              type: issue.type,
              severity: issue.severity,
              message: issue.message,
              filePath: issue.filePath,
              lineStart: issue.lineStart,
              lineEnd: issue.lineEnd,
              suggestion: issue.suggestion,
              codeSnippet: issue.codeSnippet,
            })),
          });
        }
        analyzedFilesCount++;
      } catch (error) {
        console.error(`Failed to analyze file ${file.path}:`, error);
      }
    }

    const techDebtScore = calculateScore({
      totalFiles: tree.length,
      totalLines,
      totalIssues,
      issues: allIssues,
    });

    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        status: AnalysisStatus.COMPLETED,
        completedAt: new Date(),
        analyzedFiles: analyzedFilesCount,
        totalFiles: tree.length,
        totalLines,
        totalIssues,
        techDebtScore,
      },
    });

    // revalidatePath(`/repositories/${githubId}`);
    return { success: true, analysisId: analysis.id };
  } catch (error) {
    console.error('Analysis failed:', error);
    return { success: false, error: 'Analysis failed' };
  }
}
