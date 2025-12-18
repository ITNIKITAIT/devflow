import type { GitHubClient } from '@/lib/github/client';

export function createMockGitHubClient(): Omit<GitHubClient, 'octokit'> {
  return {
    async getUserRepositories() {
      return [
        {
          githubId: 12345,
          name: 'test-repo',
          fullName: 'test-owner/test-repo',
          url: 'https://github.com/test-owner/test-repo',
          defaultBranch: 'main',
          language: 'TypeScript',
          isPrivate: false,
          description: 'Test repository',
          owner: 'test-owner',
        },
      ];
    },

    async getRepositoryTree(_owner: string, _repo: string, _sha: string) {
      return [
        {
          path: 'src/index.ts',
          mode: '100644',
          type: 'blob',
          sha: 'abc123',
          size: 100,
          url: 'https://api.github.com/repos/test-owner/test-repo/git/blobs/abc123',
        },
        {
          path: 'src/utils.ts',
          mode: '100644',
          type: 'blob',
          sha: 'def456',
          size: 200,
          url: 'https://api.github.com/repos/test-owner/test-repo/git/blobs/def456',
        },
      ];
    },

    async getFileContent(owner: string, repo: string, path: string) {
      const mockFiles: Record<string, string> = {
        'src/index.ts': `function longFunction() {
${Array(60).fill('  console.log("line");').join('\n')}
}

function manyParams(a, b, c, d, e, f, g) {
  return a + b + c + d + e + f + g;
}

const value = someFunction(42);
`,
        'src/utils.ts': `export function helper() {
  return 100;
}
`,
      };

      return mockFiles[path] || '// Empty file';
    },

    async getLatestCommit(_owner: string, _repo: string, _branch: string) {
      return 'test-commit-sha-12345';
    },

    async getRepositoryById(repoId: number) {
      return {
        data: {
          id: repoId,
          name: 'test-repo',
          full_name: 'test-owner/test-repo',
          owner: {
            login: 'test-owner',
          },
          default_branch: 'main',
        },
      } as any;
    },
  };
}
