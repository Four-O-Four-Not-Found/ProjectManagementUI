import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Project, Task } from '../../types';

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  activeProject: null,
  tasks: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setActiveProject: (state, action: PayloadAction<Project | null>) => {
      state.activeProject = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; newStatus: Task['status'] }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setProjects, 
  setActiveProject, 
  setTasks, 
  moveTask, 
  setLoading, 
  setError 
} = projectSlice.actions;

export default projectSlice.reducer;
