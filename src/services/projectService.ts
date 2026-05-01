import type { Task, TaskStatus, TaskType, Project, Sprint } from "../types";
import { signalRService } from "./signalRService";
import apiClient from "./apiClient";

export const projectService = {
	getProjects: async (): Promise<Project[]> => {
		const response = await apiClient.get<Project[]>("/projects");
		return response.data;
	},

	createProject: async (
		project: Partial<Project> & { githubRepo?: string },
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

	updateTaskStatus: async (
		taskId: string,
		status: TaskStatus,
	): Promise<void> => {
		await signalRService.invoke("UpdateTaskStatus", { taskId, status });
	},

	updateTaskType: async (taskId: string, type: TaskType): Promise<void> => {
		await signalRService.invoke("UpdateTaskType", { taskId, type });
	},

	assignTask: async (taskId: string, profileId: string): Promise<void> => {
		await signalRService.invoke("AssignTask", { taskId, profileId });
	},
};
