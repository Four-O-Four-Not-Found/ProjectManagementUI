import type { Task, TaskStatus, TaskType, Project } from "../types";
import { signalRService } from "./signalRService";
import { MOCK_TASKS, MOCK_PROJECTS } from "../mocks/data";

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PROJECTS), 500);
    });
  },

  getTasks: async (projectId: string): Promise<Task[]> => {
    console.log(`Fetching tasks for project ${projectId}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TASKS), 800);
    });
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<void> => {
    console.log(`Updating task ${taskId} to status ${status}`);
    await signalRService.invoke('UpdateTaskStatus', { taskId, status });
    return new Promise((resolve) => setTimeout(resolve, 500));
  },

  updateTaskType: async (taskId: string, type: TaskType): Promise<void> => {
    console.log(`Updating task ${taskId} to type ${type}`);
    await signalRService.invoke('UpdateTaskType', { taskId, type });
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};
