import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/(root)/repositories/[repoId]/_actions/analyze', () => ({
  analyzeRepository: jest.fn().mockResolvedValue({ success: true }),
}));

import { StartAnalysisButton } from '../StartAnalysisButton';

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('StartAnalysisButton Component', () => {
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      refresh: mockRefresh,
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  it('should render button with "Start Analysis" text', () => {
    renderWithQueryClient(
      <StartAnalysisButton
        repoId={123}
        owner="test-owner"
        repoName="test-repo"
        defaultBranch="main"
      />
    );

    expect(screen.getByRole('button', { name: /start analysis/i })).toBeTruthy();
  });

  it('should be clickable', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <StartAnalysisButton
        repoId={123}
        owner="test-owner"
        repoName="test-repo"
        defaultBranch="main"
      />
    );

    const button = screen.getByRole('button', { name: /start analysis/i });
    await user.click(button);

    // Button should be clickable (no errors thrown)
    expect(button).toBeTruthy();
  });
});
