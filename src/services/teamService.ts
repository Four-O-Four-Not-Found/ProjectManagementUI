import apiClient from "./apiClient";

export interface TeamMember {
	profileId: string;
	name: string;
	email: string;
	role: string;
}

export interface Team {
	id: string;
	name: string;
	description: string;
	inviteCode?: string;
	workspaceId: string;
	members?: TeamMember[];
}

export interface TeamCreateRequest {
	name: string;
	description: string;
	workspaceId: string;
	profileId: string;
}

export interface JoinTeamRequest {
	inviteCode: string;
	profileId: string;
}

const teamService = {
	getWorkspaceTeams: async (workspaceId: string): Promise<Team[]> => {
		const response = await apiClient.get(`/teams/workspace/${workspaceId}`);
		return response.data;
	},

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
		profileId: string,
		role: string,
	): Promise<void> => {
		await apiClient.put(`/teams/${teamId}/members/${profileId}/role`, { role });
	},
	syncGithubMembers: async (teamId: string): Promise<void> => {
		await apiClient.post(`/github/teams/${teamId}/sync`);
	},
};

export default teamService;
