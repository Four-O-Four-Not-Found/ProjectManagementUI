import axios from 'axios';

const API_URL = 'https://localhost:7296/api/github';

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
  }
};
