import axios from 'axios';

const API_URL = 'http://localhost:5139/api/github';

export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string;
  url: string;
  isPrivate: boolean;
  language: string;
  updatedAt: string;
}

export interface GitHubOrg {
  login: string;
  avatarUrl: string;
  description: string;
}

export interface GitHubBranch {
  name: string;
  commitSha: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  url: string;
}

export const githubService = {
  getRepositories: async (): Promise<GitHubRepo[]> => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;

    const response = await axios.get(`${API_URL}/repos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getOrganizations: async (): Promise<GitHubOrg[]> => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;

    const response = await axios.get(`${API_URL}/orgs`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  importTeam: async (orgName: string): Promise<{ teamId: string, name: string, memberCount: number }> => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;

    const response = await axios.post(`${API_URL}/orgs/${orgName}/import-team`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getBranches: async (owner: string, repoName: string): Promise<GitHubBranch[]> => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    const response = await axios.get(`${API_URL}/repos/${owner}/${repoName}/branches`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getCommits: async (owner: string, repoName: string): Promise<GitHubCommit[]> => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    const response = await axios.get(`${API_URL}/repos/${owner}/${repoName}/commits`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getPullRequests: async (owner: string, repoName: string): Promise<GitHubPullRequest[]> => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    const response = await axios.get(`${API_URL}/repos/${owner}/${repoName}/pulls`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createBranch: async (owner: string, repoName: string, branchName: string, baseBranch: string = "main"): Promise<GitHubBranch> => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
      : null;
    const response = await axios.post(`${API_URL}/repos/${owner}/${repoName}/branches`, {
      branchName,
      baseBranch
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
