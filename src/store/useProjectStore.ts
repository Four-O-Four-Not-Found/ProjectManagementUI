import { create } from 'zustand';

export interface Task {
  id: string;
  taskId: string; // e.g., WEB-42
  title: string;
  description: string;
  status: 'Backlog' | 'Todo' | 'InProgress' | 'InReview' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assigneeId?: string;
  projectId: string;
  githubPrUrl?: string;
  githubBranchName?: string;
}

export interface Project {
  id: string;
  name: string;
  key: string; // e.g., WEB
  description: string;
}

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  tasks: Task[];
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProject: null,
  tasks: [],
  setProjects: (projects) => set({ projects }),
  setActiveProject: (activeProject) => set({ activeProject }),
  setTasks: (tasks) => set({ tasks }),
  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === taskId ? { ...task, status: newStatus } : task
    )
  })),
}));
