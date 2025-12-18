import { render, screen } from '@testing-library/react';

import { RepositoryHeader } from '../RepositoryHeader';

describe('RepositoryHeader Component', () => {
  const mockRepo = {
    name: 'test-repo',
    private: false,
    description: 'A test repository',
    language: 'TypeScript',
    default_branch: 'main',
    stargazers_count: 42,
    watchers_count: 10,
  };

  it('should render repository name and description', () => {
    render(<RepositoryHeader repo={mockRepo} />);

    expect(screen.getByText('test-repo')).toBeTruthy();
    expect(screen.getByText('A test repository')).toBeTruthy();
  });

  it('should render public badge for public repository', () => {
    render(<RepositoryHeader repo={mockRepo} />);

    expect(screen.getByText('Public')).toBeTruthy();
  });

  it('should render private badge for private repository', () => {
    render(<RepositoryHeader repo={{ ...mockRepo, private: true }} />);

    expect(screen.getByText('Private')).toBeTruthy();
  });

  it('should render repository stats', () => {
    render(<RepositoryHeader repo={mockRepo} />);

    expect(screen.getByText('TypeScript')).toBeTruthy();
    expect(screen.getByText(/42 stars/i)).toBeTruthy();
    expect(screen.getByText(/10 watchers/i)).toBeTruthy();
  });
});
