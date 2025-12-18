import { type Analysis, AnalysisStatus } from '@prisma/client';
import { render, screen } from '@testing-library/react';

import { AnalysisList } from '../AnalysisList';

describe('AnalysisList Component', () => {
  const mockAnalyses: Analysis[] = [
    {
      id: '1',
      repositoryId: 123,
      userId: 'user-1',
      commitSha: 'abc1234',
      branch: 'main',
      status: AnalysisStatus.COMPLETED,
      techDebtScore: 85,
      totalIssues: 5,
      criticalIssues: 0,
      highIssues: 1,
      mediumIssues: 2,
      lowIssues: 2,
      avgComplexity: 2.5,
      duplicateLines: 10,
      duplicatePercent: 2.0,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      startedAt: new Date('2024-01-01T10:00:00Z'),
      completedAt: new Date('2024-01-01T10:05:00Z'),
      analyzedFiles: 10,
      totalFiles: 10,
      totalLines: 500,
    },
    {
      id: '2',
      repositoryId: 123,
      userId: 'user-1',
      commitSha: 'def5678',
      branch: 'main',
      status: AnalysisStatus.RUNNING,
      techDebtScore: 0,
      totalIssues: 0,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0,
      avgComplexity: 0,
      duplicateLines: 0,
      duplicatePercent: 0,
      createdAt: new Date('2024-01-02T10:00:00Z'),
      startedAt: new Date('2024-01-02T10:00:00Z'),
      completedAt: null,
      analyzedFiles: 0,
      totalFiles: 0,
      totalLines: 0,
    },
  ];

  it('should render analysis list with title', () => {
    render(<AnalysisList analyses={mockAnalyses} />);

    expect(screen.getByText('Analysis History')).toBeTruthy();
  });

  it('should render all analyses in the list', () => {
    render(<AnalysisList analyses={mockAnalyses} />);

    expect(screen.getByText('abc1234')).toBeTruthy();
    expect(screen.getByText('def5678')).toBeTruthy();
  });

  it('should render analysis status', () => {
    render(<AnalysisList analyses={mockAnalyses} />);

    expect(screen.getByText('completed')).toBeTruthy();
    expect(screen.getByText('running')).toBeTruthy();
  });

  it('should render tech debt score and issues', () => {
    render(<AnalysisList analyses={[mockAnalyses[0]]} />);

    expect(screen.getByText('85%')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });
});
