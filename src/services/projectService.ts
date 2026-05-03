import type {
	Task,
	TaskStatus,
	TaskType,
	Project,
	Sprint,
	Repository,
	Comment,
	Attachment,
} from "../types";
import { signalRService } from "./signalRService";
import apiClient from "./apiClient";

export const projectService = {
	getProjects: async (): Promise<Project[]> => {
		const response = await apiClient.get<Project[]>("/projects");
		return response.data;
	},

	createProject: async (
		project: Partial<Project> & { 
			gitHubRepoName?: string; 
			ownerId?: string; 
			ownerType?: "User" | "Team";
		},
	): Promise<Project> => {
		const response = await apiClient.post<Project>("/projects", project);
		return response.data;
	},

	createTask: async (task: Partial<Task>): Promise<Task> => {
		const response = await apiClient.post<Task>("/tasks", task);
		return response.data;
	},

	getProjectBoard: async (id: string): Promise<Project> => {
		const response = await apiClient.get<Project>(`/projects/${id}/board`);
		return response.data;
	},

	updateProject: async (
		id: string,
		project: Partial<Project> & { gitHubRepo?: string },
	): Promise<Project> => {
		const response = await apiClient.put<Project>(`/projects/${id}`, project);
		return response.data;
	},

	getTasks: async (projectId: string): Promise<Task[]> => {
		const response = await apiClient.get<Task[]>(
			`/projects/${projectId}/tasks`,
		);
		return response.data;
	},

	getSprints: async (projectId: string): Promise<Sprint[]> => {
		const response = await apiClient.get<Sprint[]>(
			`/projects/${projectId}/sprints`,
		);
		return response.data;
	},

	getRepositories: async (projectId: string): Promise<Repository[]> => {
		const response = await apiClient.get<Repository[]>(
			`/projects/${projectId}/repositories`,
		);
		return response.data;
	},

	updateTaskStatus: async (
		taskId: string,
		status: TaskStatus,
	): Promise<void> => {
		await signalRService.invoke("UpdateTaskStatus", { taskId, status });
	},

	updateTaskType: async (taskId: string, type: TaskType): Promise<void> => {
		await signalRService.invoke("UpdateTaskType", { taskId, type });
	},

	assignTask: async (taskId: string, userId: string): Promise<void> => {
		await signalRService.invoke("AssignTask", { taskId, userId });
	},

	decomposeTask: async (taskId: string): Promise<Task[]> => {
		const response = await apiClient.post<Task[]>(`/tasks/${taskId}/decompose`);
		return response.data;
	},

	addComment: async (
		taskId: string,
		userId: string,
		content: string,
	): Promise<Comment> => {
		const response = await apiClient.post<Comment>(`/tasks/${taskId}/comments`, {
			userId,
			content,
		});
		return response.data;
	},

	addAttachment: async (
		taskId: string,
		attachment: {
			fileName: string;
			fileUrl: string;
			fileType: string;
			fileSize: number;
		},
	): Promise<Attachment> => {
		const response = await apiClient.post<Attachment>(
			`/tasks/${taskId}/attachments`,
			attachment,
		);
		return response.data;
	},

	updateTaskDetails: async (
		taskId: string,
		userId: string,
		title: string,
		description: string,
	): Promise<void> => {
		await apiClient.put(`/tasks/${taskId}`, { userId, title, description });
	},

	getTask: async (taskId: string): Promise<Task> => {
		const response = await apiClient.get<Task>(`/tasks/${taskId}`);
		return response.data;
	},
};
