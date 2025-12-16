import { Octokit } from '@octokit/rest';

import { requireAuth } from '../auth';

let githubClientInstance: GitHubClient | null = null;

class GitHubClient {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  async getUserRepositories() {
    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
      });

      return data.map((repo) => ({
        githubId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        defaultBranch: repo.default_branch,
        language: repo.language,
        isPrivate: repo.private,
        description: repo.description,
      }));
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw new Error('Failed to fetch repositories from GitHub');
    }
  }

  async getRepositoryTree(owner: string, repo: string, sha: string) {
    try {
      const { data } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: sha,
        recursive: 'true',
      });

      return data.tree
        .filter((item) => item.type === 'blob') // Only files
        .filter((item) => {
          const path = item.path || '';
          // Filter only JS/TS files
          return /\.(js|jsx|ts|tsx)$/.test(path);
        });
    } catch (error) {
      console.error('Error fetching repository tree:', error);
      throw new Error('Failed to fetch repository files');
    }
  }

  async getFileContent(owner: string, repo: string, path: string) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if ('content' in data) {
        // Decode base64 content
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return content;
      }

      throw new Error('Not a file');
    } catch (error) {
      console.error(`Error fetching file ${path}:`, error);
      throw new Error(`Failed to fetch file: ${path}`);
    }
  }

  async getLatestCommit(owner: string, repo: string, branch: string = 'main') {
    try {
      const { data } = await this.octokit.repos.getBranch({
        owner,
        repo,
        branch,
      });

      return data.commit.sha;
    } catch (error) {
      console.error('Error fetching latest commit:', error);
      throw new Error('Failed to fetch latest commit');
    }
  }
}

export async function getGitHubClient() {
  const session = await requireAuth();
  const accessToken = (session.user as any).accessToken;

  if (!accessToken) {
    throw new Error('No GitHub access token found');
  }

  if (!githubClientInstance) {
    githubClientInstance = new GitHubClient(accessToken);
  }

  return githubClientInstance;
}
