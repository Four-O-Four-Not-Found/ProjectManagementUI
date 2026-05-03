import apiClient from "./apiClient";

export interface TeamMember {
	userId: string;
	name: string;
	email: string;
	role: string;
}

export interface Team {
	id: string;
	name: string;
	description: string;
	inviteCode?: string;
	githubOrgId?: string;
	avatarUrl?: string;
	members?: TeamMember[];
}

export interface TeamCreateRequest {
	name: string;
	description: string;
	userId: string;
}

export interface JoinTeamRequest {
	inviteCode: string;
	userId: string;
}

const teamService = {
	getTeam: async (id: string): Promise<Team> => {
		const response = await apiClient.get(`/teams/${id}`);
		return response.data;
	},

	createTeam: async (request: TeamCreateRequest): Promise<Team> => {
		const response = await apiClient.post("/teams", request);
		return response.data;
	},

	getTeamByInviteCode: async (code: string): Promise<Team> => {
		const response = await apiClient.get(`/teams/invite/${code}`);
		return response.data;
	},

	joinTeam: async (request: JoinTeamRequest): Promise<void> => {
		await apiClient.post("/teams/join", request);
	},

	updateMemberRole: async (
		teamId: string,
		userId: string,
		role: string,
	): Promise<void> => {
		await apiClient.put(`/teams/${teamId}/members/${userId}/role`, { role });
	},
	syncGithubMembers: async (teamId: string): Promise<void> => {
		await apiClient.post(`/github/teams/${teamId}/sync`);
	},
	getMyTeams: async (): Promise<Team[]> => {
		const response = await apiClient.get("/teams");
		return response.data;
	},
};

export default teamService;
