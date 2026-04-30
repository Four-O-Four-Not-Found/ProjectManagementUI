import type { Task, TaskStatus, TaskType, Project } from "../types";
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
		console.log(`Fetching tasks for project ${projectId}`);
		return new Promise((resolve) => {
			// Return empty tasks instead of MOCK_TASKS to prevent placeholders
			setTimeout(() => resolve([]), 300);
		});
	},

	updateTaskStatus: async (
		taskId: string,
		status: TaskStatus,
	): Promise<void> => {
		console.log(`Updating task ${taskId} to status ${status}`);
		await signalRService.invoke("UpdateTaskStatus", { taskId, status });
		return new Promise((resolve) => setTimeout(resolve, 500));
	},

	updateTaskType: async (taskId: string, type: TaskType): Promise<void> => {
		console.log(`Updating task ${taskId} to type ${type}`);
		await signalRService.invoke("UpdateTaskType", { taskId, type });
		return new Promise((resolve) => setTimeout(resolve, 500));
	},
};
