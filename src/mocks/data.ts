import type { Task, Project, Sprint, User, Activity } from "../types";

export const MOCK_USER: User = {
  id: 'u1',
  email: 'dev@novaflow.io',
  displayName: 'Alex Rivers',
  role: 'Admin',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  githubId: 'arivers-dev'
};

export const MOCK_PROJECTS: Project[] = [
  { 
    id: '1', 
    name: 'NovaFlow Platform', 
    key: 'WEB', 
    description: 'Core project management platform',
    ownerId: 'u1',
    ownerType: 'User',
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  { 
    id: '2', 
    name: 'WareSense AI', 
    key: 'WS', 
    description: 'Inventory management with AI',
    ownerId: 'u1',
    ownerType: 'User',
    createdAt: '2026-04-15T00:00:00Z',
    updatedAt: '2026-04-15T00:00:00Z'
  },
  { 
    id: '3', 
    name: 'Horizon Mobile', 
    key: 'HM', 
    description: 'Cross-platform mobile app',
    ownerId: 'u1',
    ownerType: 'User',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  }
];

export const MOCK_SPRINTS: Sprint[] = [
  {
    id: 's1',
    name: 'Sprint 24 - Core Hub',
    startDate: '2026-04-01',
    endDate: '2026-04-14',
    status: 'Active',
    taskCount: 12,
    completedTasks: 8,
    projectId: '1'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    taskKey: 'WEB-101',
    title: 'Implement Dark Mode Water-morphism',
    description: 'Create a high-fidelity glassmorphism effect.',
    status: 'ToDo',
    priority: 'High',
    type: 'Feature',
    projectId: '1',
    columnId: 'col1',
    createdAt: '2026-04-18T00:00:00Z',
    updatedAt: '2026-04-18T00:00:00Z'
  },
  {
    id: '2',
    taskKey: 'WEB-102',
    title: 'SignalR Connection Latency',
    description: 'Latency optimization.',
    status: 'InProgress',
    priority: 'Urgent',
    type: 'Issue',
    projectId: '1',
    columnId: 'col1',
    createdAt: '2026-04-23T00:00:00Z',
    updatedAt: '2026-04-23T00:00:00Z'
  },
  {
    id: '3',
    taskKey: 'WEB-103',
    title: 'Add Drag and Drop to Board',
    description: 'Smooth transitions.',
    status: 'InReview',
    priority: 'Medium',
    type: 'Suggestion',
    projectId: '1',
    columnId: 'col1',
    createdAt: '2026-04-29T00:00:00Z',
    updatedAt: '2026-04-29T00:00:00Z'
  },
  {
    id: '4',
    taskKey: 'WEB-104',
    title: 'Auth Flow Refactor',
    description: 'Refresh Tokens.',
    status: 'Done',
    priority: 'High',
    type: 'Feature',
    projectId: '1',
    columnId: 'col1',
    createdAt: '2026-04-16T00:00:00Z',
    updatedAt: '2026-04-16T00:00:00Z'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    userId: "u1",
    action: "moved",
    target: "WEB-101",
    createdAt: "2026-04-24T10:00:00Z",
    projectId: "1",
  },
  {
    id: "2",
    userId: "u1",
    action: "commented on",
    target: "WEB-102",
    createdAt: "2026-04-25T11:00:00Z",
    projectId: "1",
  },
  {
    id: "3",
    userId: "u1",
    action: "completed",
    target: "WEB-104",
    createdAt: "2026-04-22T09:00:00Z",
    projectId: "1",
  },
];
