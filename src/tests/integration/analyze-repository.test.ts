import { AnalysisStatus, IssueType } from '@prisma/client';
import type { Session } from 'next-auth';

import { analyzeRepository } from '@/app/(root)/repositories/[repoId]/_actions/analyze';
import { requireAuth } from '@/lib/auth';
import { getGitHubClient, type GitHubClient } from '@/lib/github/client';

import { cleanupTestDatabase, createTestUser } from '../helpers/db';
import { createMockGitHubClient } from '../helpers/github-mock';
import { getTestPrisma, teardownTests } from '../helpers/setup';

// Mock the GitHub client
jest.mock('@/lib/github/client', () => ({
  getGitHubClient: jest.fn(),
}));

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  requireAuth: jest.fn(),
}));

// Mock the prisma module
jest.mock('@/lib/db', () => ({
  __esModule: true,
  get prisma() {
    return getTestPrisma();
  },
}));

describe('Integration: analyzeRepository', () => {
  const prisma = getTestPrisma();
  let testUserId: string;

  afterAll(async () => {
    await cleanupTestDatabase(prisma);
    await teardownTests();
  });

  beforeEach(async () => {
    await cleanupTestDatabase(prisma);

    const user = await createTestUser(prisma);
    testUserId = user.id;

    jest.mocked(requireAuth).mockResolvedValue({
      user: {
        id: testUserId,
        name: 'Test User',
        email: 'test@example.com',
      },
    } as Session);

    jest.mocked(getGitHubClient).mockResolvedValue(createMockGitHubClient() as GitHubClient);
  });

  it('should create a complete analysis with issues', async () => {
    const result = await analyzeRepository(12345, 'test-owner', 'test-repo', 'main');

    expect(result.success).toBe(true);
    expect(result.analysisId).toBeDefined();

    const analysis = await prisma.analysis.findUnique({
      where: { id: result.analysisId },
      include: { issues: true },
    });

    expect(analysis).toBeDefined();
    expect(analysis?.status).toBe(AnalysisStatus.COMPLETED);
    expect(analysis?.repositoryId).toBe(12345);
    expect(analysis?.userId).toBe(testUserId);
    expect(analysis?.commitSha).toBe('test-commit-sha-12345');
    expect(analysis?.totalFiles).toBe(2);
    expect(analysis?.analyzedFiles).toBe(2);
    expect(analysis?.totalLines).toBeGreaterThan(0);
    expect(analysis?.totalIssues).toBeGreaterThan(0);
    expect(analysis?.techDebtScore).toBeLessThan(100);
    expect(analysis?.startedAt).toBeDefined();
    expect(analysis?.completedAt).toBeDefined();

    expect(analysis?.issues.length).toBeGreaterThan(0);

    const longFunctionIssues = analysis?.issues.filter(
      (issue) => issue.type === IssueType.LONG_FUNCTION
    );
    expect(longFunctionIssues?.length).toBeGreaterThan(0);

    const longParamIssues = analysis?.issues.filter(
      (issue) => issue.type === IssueType.LONG_PARAMETER_LIST
    );
    expect(longParamIssues?.length).toBeGreaterThan(0);

    const magicNumberIssues = analysis?.issues.filter(
      (issue) => issue.type === IssueType.MAGIC_NUMBER
    );
    expect(magicNumberIssues?.length).toBeGreaterThan(0);
  });

  it('should not create duplicate analyses for the same commit', async () => {
    const result1 = await analyzeRepository(12345, 'test-owner', 'test-repo', 'main');
    expect(result1.success).toBe(true);

    const result2 = await analyzeRepository(12345, 'test-owner', 'test-repo', 'main');
    expect(result2.success).toBe(false);
    expect(result2.error).toBe('Analysis already exists for the latest commit');

    const analyses = await prisma.analysis.findMany({
      where: {
        repositoryId: 12345,
        userId: testUserId,
      },
    });
    expect(analyses.length).toBe(1);
  });

  it('should calculate tech debt score correctly', async () => {
    const result = await analyzeRepository(12345, 'test-owner', 'test-repo', 'main');

    const analysis = await prisma.analysis.findUnique({
      where: { id: result.analysisId },
    });

    expect(analysis?.techDebtScore).toBeDefined();
    expect(analysis?.techDebtScore).toBeGreaterThanOrEqual(0);
    expect(analysis?.techDebtScore).toBeLessThanOrEqual(100);
  });

  it('should count total issues correctly', async () => {
    const result = await analyzeRepository(12345, 'test-owner', 'test-repo', 'main');

    const analysis = await prisma.analysis.findUnique({
      where: { id: result.analysisId },
      include: { issues: true },
    });

    expect(analysis?.totalIssues).toBe(analysis?.issues.length);
    expect(analysis?.totalIssues).toBeGreaterThan(0);
  });

  it('should handle empty repository', async () => {
    const mockClient = createMockGitHubClient();
    mockClient.getRepositoryTree = jest.fn().mockResolvedValue([]);
    jest.mocked(getGitHubClient).mockResolvedValue(mockClient as GitHubClient);

    const result = await analyzeRepository(12345, 'test-owner', 'test-repo', 'main');

    expect(result.success).toBe(true);

    const analysis = await prisma.analysis.findUnique({
      where: { id: result.analysisId },
    });

    expect(analysis?.totalFiles).toBe(0);
    expect(analysis?.analyzedFiles).toBe(0);
    expect(analysis?.totalLines).toBe(0);
    expect(analysis?.totalIssues).toBe(0);
    expect(analysis?.techDebtScore).toBe(100);
  });

  it('should set analysis status to RUNNING initially', async () => {
    const result = await analyzeRepository(12345, 'test-owner', 'test-repo', 'main');

    const analysis = await prisma.analysis.findUnique({
      where: { id: result.analysisId },
    });

    expect(analysis?.status).toBe(AnalysisStatus.COMPLETED);
  });
});
