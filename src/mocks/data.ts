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
    startDate: '2026-04-01',
    endDate: '2026-06-30'
  },
  { 
    id: '2', 
    name: 'WareSense AI', 
    key: 'WS', 
    description: 'Inventory management with AI',
    startDate: '2026-04-15',
    endDate: '2026-05-15'
  },
  { 
    id: '3', 
    name: 'Horizon Mobile', 
    key: 'HM', 
    description: 'Cross-platform mobile app',
    startDate: '2026-05-01',
    endDate: '2026-07-15'
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
    completedTasks: 8
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    taskId: 'WEB-101',
    title: 'Implement Dark Mode Water-morphism',
    description: 'Create a high-fidelity glassmorphism effect.',
    status: 'Todo',
    priority: 'High',
    type: 'Feature',
    projectId: '1',
    assignee: { name: 'Sarah Drasner', avatar: 'Sarah' },
    startDate: '2026-04-18',
    endDate: '2026-04-22',
    progress: 100,
    dependencies: []
  },
  {
    id: '2',
    taskId: 'WEB-102',
    title: 'SignalR Connection Latency',
    description: 'Latency optimization.',
    status: 'InProgress',
    priority: 'Urgent',
    type: 'Issue',
    projectId: '1',
    assignee: { name: 'Dan Abramov', avatar: 'Dan' },
    startDate: '2026-04-23',
    endDate: '2026-04-28',
    progress: 45,
    dependencies: ['1']
  },
  {
    id: '3',
    taskId: 'WEB-103',
    title: 'Add Drag and Drop to Board',
    description: 'Smooth transitions.',
    status: 'InReview',
    priority: 'Medium',
    type: 'Suggestion',
    projectId: '1',
    assignee: { name: 'Sarah Drasner', avatar: 'Sarah' },
    startDate: '2026-04-29',
    endDate: '2026-05-04',
    progress: 15,
    dependencies: ['2']
  },
  {
    id: '4',
    taskId: 'WEB-104',
    title: 'Auth Flow Refactor',
    description: 'Refresh Tokens.',
    status: 'Done',
    priority: 'High',
    type: 'Feature',
    projectId: '1',
    assignee: { name: 'Alex Rivers', avatar: 'Alex' },
    startDate: '2026-04-16',
    endDate: '2026-04-21',
    progress: 100
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    userId: "1",
    userName: "Sarah",
    userAvatar: "Sarah",
    action: "moved",
    target: "WEB-101",
    timestamp: "2m ago",
    date: '2026-04-24',
    type: "status_change",
  },
  {
    id: "2",
    userId: "2",
    userName: "John",
    userAvatar: "John",
    action: "commented on",
    target: "WEB-102",
    timestamp: "15m ago",
    date: '2026-04-25',
    type: "comment",
  },
  {
    id: "3",
    userId: "1",
    userName: "Sarah",
    userAvatar: "Sarah",
    action: "completed",
    target: "WEB-104",
    timestamp: "2h ago",
    date: '2026-04-22',
    type: "status_change",
  },
];
