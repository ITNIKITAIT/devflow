import { AnalysisStatus, IssueType, type User } from '@prisma/client';

import { CodeAnalyzer } from '@/lib/analysis/analyzer';
import { calculateScore } from '@/lib/analysis/score';

import { cleanupTestDatabase, createTestUser } from '../helpers/db';
import { getTestPrisma, teardownTests } from '../helpers/setup';

describe('Integration: Analysis Workflow', () => {
  const prisma = getTestPrisma();
  let user: User;

  afterAll(async () => {
    await cleanupTestDatabase(prisma);
    await teardownTests();
  });

  beforeEach(async () => {
    await cleanupTestDatabase(prisma);
    user = await createTestUser(prisma);
  });

  it('should complete full analysis workflow: analyze -> calculate score -> save to database', async () => {
    const analysis = await prisma.analysis.create({
      data: {
        repositoryId: 12345,
        userId: user.id,
        commitSha: 'test-commit',
        status: AnalysisStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    const analyzer = new CodeAnalyzer();
    const mockFiles = [
      {
        path: 'src/index.ts',
        content: `function longFunction() {
${Array(60).fill('  console.log("line");').join('\n')}
}

function manyParams(a, b, c, d, e, f, g) {
  return a + b + c + d + e + f + g;
}

const value = someFunction(42);
`,
      },
      {
        path: 'src/utils.ts',
        content: `export function helper() {
  return 100;
}
`,
      },
    ];

    let totalIssues = 0;
    let totalLines = 0;
    const allIssues = [];

    for (const file of mockFiles) {
      const issues = analyzer.analyzeFile(file.content, file.path);
      totalLines += file.content.split('\n').length;
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
    }

    const techDebtScore = calculateScore({
      totalFiles: mockFiles.length,
      totalLines,
      totalIssues,
      issues: allIssues,
    });

    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        status: AnalysisStatus.COMPLETED,
        completedAt: new Date(),
        analyzedFiles: mockFiles.length,
        totalFiles: mockFiles.length,
        totalLines,
        totalIssues,
        techDebtScore,
      },
    });

    const completedAnalysis = await prisma.analysis.findUnique({
      where: { id: analysis.id },
      include: { issues: true },
    });

    expect(completedAnalysis).toBeDefined();
    expect(completedAnalysis?.status).toBe(AnalysisStatus.COMPLETED);
    expect(completedAnalysis?.totalFiles).toBe(mockFiles.length);
    expect(completedAnalysis?.totalLines).toBe(totalLines);
    expect(completedAnalysis?.totalIssues).toBe(totalIssues);
    expect(completedAnalysis?.techDebtScore).toBe(techDebtScore);
    expect(completedAnalysis?.issues.length).toBe(totalIssues);
    expect(completedAnalysis?.startedAt).toBeDefined();
    expect(completedAnalysis?.completedAt).toBeDefined();

    const longFunctionIssues = completedAnalysis?.issues.filter(
      (i) => i.type === IssueType.LONG_FUNCTION
    );
    expect(longFunctionIssues?.length).toBeGreaterThan(0);

    const longParamIssues = completedAnalysis?.issues.filter(
      (i) => i.type === IssueType.LONG_PARAMETER_LIST
    );
    expect(longParamIssues?.length).toBeGreaterThan(0);

    const magicNumberIssues = completedAnalysis?.issues.filter(
      (i) => i.type === IssueType.MAGIC_NUMBER
    );
    expect(magicNumberIssues?.length).toBeGreaterThan(0);
  });

  it('should handle analysis with no issues', async () => {
    const user = await createTestUser(prisma);

    const analysis = await prisma.analysis.create({
      data: {
        repositoryId: 12345,
        userId: user.id,
        commitSha: 'test-commit',
        status: AnalysisStatus.RUNNING,
      },
    });

    const analyzer = new CodeAnalyzer();
    const cleanCode = `export function cleanFunction() {
  return 'clean code';
}
`;

    const issues = analyzer.analyzeFile(cleanCode, 'src/clean.ts');
    const totalLines = cleanCode.split('\n').length;

    const techDebtScore = calculateScore({
      totalFiles: 1,
      totalLines,
      totalIssues: issues.length,
      issues,
    });

    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        status: AnalysisStatus.COMPLETED,
        completedAt: new Date(),
        analyzedFiles: 1,
        totalFiles: 1,
        totalLines,
        totalIssues: 0,
        techDebtScore,
      },
    });

    const completedAnalysis = await prisma.analysis.findUnique({
      where: { id: analysis.id },
      include: { issues: true },
    });

    expect(completedAnalysis?.totalIssues).toBe(0);
    expect(completedAnalysis?.issues.length).toBe(0);
    expect(completedAnalysis?.techDebtScore).toBe(100);
  });
});
