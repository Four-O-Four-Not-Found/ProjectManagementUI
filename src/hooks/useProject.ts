import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  setProjects, 
  setTasks, 
  moveTask as moveTaskAction, 
  setLoading, 
  setError 
} from '../redux/slices/projectSlice';
import { projectService } from '../services/projectService';
import type { Task, Project } from '../types';

export const useProject = () => {
  const dispatch = useAppDispatch();
  const { projects, activeProject, tasks, loading, error } = useAppSelector((state) => state.project);

	const refreshTask = useCallback(async (taskId: string) => {
		try {
			const updatedTask = await projectService.getTask(taskId);
			// We need a reducer for this
			dispatch(setTasks(tasks.map(t => t.id === taskId ? updatedTask : t)));
		} catch (err) {
			console.error("Refresh task failed:", err);
		}
	}, [dispatch, tasks]);

	const fetchProjects = useCallback(async () => {
		dispatch(setLoading(true));
		try {
			const data = await projectService.getProjects();
			dispatch(setProjects(data));
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to fetch projects";
			dispatch(setError(message));
		} finally {
			dispatch(setLoading(false));
		}
	}, [dispatch]);

	const fetchTasks = useCallback(async (projectId: string) => {
		dispatch(setLoading(true));
		try {
			const data = await projectService.getTasks(projectId);
			dispatch(setTasks(data));
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to fetch tasks";
			dispatch(setError(message));
		} finally {
			dispatch(setLoading(false));
		}
	}, [dispatch]);

	const moveTask = useCallback(async (taskId: string, newStatus: Task["status"]) => {
		// Optimistic update
		dispatch(moveTaskAction({ taskId, newStatus }));
		try {
			await projectService.updateTaskStatus(taskId, newStatus);
		} catch (err) {
			console.error("Move task failed:", err);
			dispatch(setError("Failed to move task"));
		}
	}, [dispatch]);

	const assignTask = useCallback(async (taskId: string, profileId: string) => {
		try {
			await projectService.assignTask(taskId, profileId);
			await refreshTask(taskId);
		} catch (err) {
			console.error("Assign task failed:", err);
			dispatch(setError("Failed to assign task"));
		}
	}, [dispatch, refreshTask]);

	const createTask = useCallback(async (data: Partial<Task>) => {
		try {
			await projectService.createTask(data);
			if (data.projectId) {
				await fetchTasks(data.projectId);
			}
		} catch (err) {
			console.error("Create task failed:", err);
			dispatch(setError("Failed to create task"));
		}
	}, [dispatch, fetchTasks]);

	const createProject = useCallback(async (data: Partial<Project>) => {
		try {
			await projectService.createProject(data);
			await fetchProjects();
		} catch (err) {
			console.error("Create project failed:", err);
			dispatch(setError("Failed to create project"));
		}
	}, [dispatch, fetchProjects]);

	const addComment = useCallback(async (taskId: string, userId: string, content: string) => {
		try {
			await projectService.addComment(taskId, userId, content);
			await refreshTask(taskId);
		} catch (err) {
			console.error("Add comment failed:", err);
			dispatch(setError("Failed to add comment"));
		}
	}, [dispatch, refreshTask]);

	const addAttachment = useCallback(async (taskId: string, attachment: { fileName: string; fileUrl: string; fileType: string; fileSize: number }) => {
		try {
			await projectService.addAttachment(taskId, attachment);
		} catch (err) {
			console.error("Add attachment failed:", err);
			dispatch(setError("Failed to add attachment"));
		}
	}, [dispatch]);

	const updateTaskDetails = useCallback(async (taskId: string, userId: string, title: string, description: string) => {
		try {
			await projectService.updateTaskDetails(taskId, userId, title, description);
		} catch (err) {
			console.error("Update task failed:", err);
			dispatch(setError("Failed to update task details"));
		}
	}, [dispatch]);

	return {
		projects,
		activeProject,
		tasks,
		loading,
		error,
		fetchProjects,
		fetchTasks,
		moveTask,
		assignTask,
		createTask,
		createProject,
		addComment,
		addAttachment,
		updateTaskDetails,
		refreshTask,
	};
};
