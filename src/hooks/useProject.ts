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
import type { Task } from '../types';

export const useProject = () => {
  const dispatch = useAppDispatch();
  const { projects, activeProject, tasks, loading, error } = useAppSelector((state) => state.project);

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

	return {
		projects,
		activeProject,
		tasks,
		loading,
		error,
		fetchProjects,
		fetchTasks,
		moveTask,
	};
};
