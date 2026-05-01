import apiClient from "./apiClient";

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

export interface GitHubCommitDetail extends GitHubCommit {
	files: {
		filename: string;
		status: string;
		additions: number;
		deletions: number;
		patch: string;
	}[];
	additions: number;
	deletions: number;
	totalChanges: number;
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
		const response = await apiClient.get("/github/repos");
		return response.data;
	},

	getOrganizations: async (): Promise<GitHubOrg[]> => {
		const response = await apiClient.get("/github/orgs");
		return response.data;
	},

	importTeam: async (
		orgName: string,
	): Promise<{ teamId: string; name: string; memberCount: number }> => {
		const response = await apiClient.post(
			`/github/orgs/${orgName}/import-team`,
			{},
		);
		return response.data;
	},

	getBranches: async (
		owner: string,
		repoName: string,
	): Promise<GitHubBranch[]> => {
		const response = await apiClient.get(
			`/github/repos/${owner}/${repoName}/branches`,
		);
		return response.data;
	},

	getCommits: async (
		owner: string,
		repoName: string,
	): Promise<GitHubCommit[]> => {
		const response = await apiClient.get(
			`/github/repos/${owner}/${repoName}/commits`,
		);
		return response.data;
	},

	getCommitDetails: async (
		owner: string,
		repoName: string,
		sha: string,
	): Promise<GitHubCommitDetail> => {
		const response = await apiClient.get(
			`/github/repos/${owner}/${repoName}/commits/${sha}`,
		);
		return response.data;
	},

	getPullRequests: async (
		owner: string,
		repoName: string,
	): Promise<GitHubPullRequest[]> => {
		const response = await apiClient.get(
			`/github/repos/${owner}/${repoName}/pulls`,
		);
		return response.data;
	},

	createBranch: async (
		owner: string,
		repoName: string,
		branchName: string,
		baseBranch: string = "main",
	): Promise<GitHubBranch> => {
		const response = await apiClient.post(
			`/github/repos/${owner}/${repoName}/branches`,
			{
				branchName,
				baseBranch,
			},
		);
		return response.data;
	},

	deleteBranch: async (
		owner: string,
		repoName: string,
		branchName: string,
	): Promise<void> => {
		await apiClient.delete(
			`/github/repos/${owner}/${repoName}/branches/${branchName}`,
		);
	},

	deletePullRequest: async (
		owner: string,
		repoName: string,
		number: number,
	): Promise<void> => {
		await apiClient.delete(
			`/github/repos/${owner}/${repoName}/pulls/${number}`,
		);
	},

	createRepository: async (
		name: string,
		description: string,
		isPrivate: boolean = true,
		orgName?: string,
	): Promise<GitHubRepo> => {
		const url = orgName ? `/github/orgs/${orgName}/repos` : "/github/repos";
		const response = await apiClient.post(url, {
			name,
			description,
			isPrivate,
		});
		return response.data;
	},

	getRepoDetails: async (
		owner: string,
		repoName: string,
	): Promise<GitHubRepoDetails> => {
		const response = await apiClient.get(
			`/github/repos/${owner}/${repoName}/details`,
		);
		return response.data;
	},

	updateFile: async (
		owner: string,
		repoName: string,
		path: string,
		content: string,
		message: string,
		branch: string,
	): Promise<void> => {
		await apiClient.put(`/github/repos/${owner}/${repoName}/files`, {
			path,
			content,
			message,
			branch,
		});
	},
};

export interface GitHubRepoDetails {
	tree: {
		path: string;
		type: string;
		size?: number;
	}[];
	languages: string[];
	techStackSummary: string;
}
