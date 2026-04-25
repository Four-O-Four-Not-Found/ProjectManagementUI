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
  { id: '1', name: 'FlowState Platform', key: 'WEB', description: 'Core project management platform' },
  { id: '2', name: 'WareSense AI', key: 'WS', description: 'Inventory management with AI' },
  { id: '3', name: 'Horizon Mobile', key: 'HM', description: 'Cross-platform mobile app' }
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
    description: 'Create a high-fidelity glassmorphism effect using Tailwind v4 and dynamic gradients.',
    status: 'Todo',
    priority: 'High',
    type: 'Feature',
    projectId: '1',
    assignee: { name: 'Sarah Drasner', avatar: 'Sarah' },
    startDate: '2026-04-20',
    endDate: '2026-04-25',
    attachments: [
      { id: 'att-1', name: 'Design Spec', type: 'image', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop', size: '1.2MB' }
    ],
    comments: [
      { id: 'c1', userId: '2', userName: 'John', content: 'We should ensure the blur-radius is at least 20px.', timestamp: '1h ago' }
    ]
  },
  {
    id: '2',
    taskId: 'WEB-102',
    title: 'SignalR Connection Latency',
    description: 'Users are reporting 500ms+ latency during peak hours on the websocket connection.',
    status: 'InProgress',
    priority: 'Urgent',
    type: 'Issue',
    projectId: '1',
    assignee: { name: 'Dan Abramov', avatar: 'Dan' },
    startDate: '2026-04-22',
    endDate: '2026-04-28',
    attachments: [
      { id: 'att-2', name: 'Latency Graph', type: 'image', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', size: '800KB' }
    ]
  },
  {
    id: '3',
    taskId: 'WEB-103',
    title: 'Add Drag and Drop to Board',
    description: 'Use dnd-kit or react-beautiful-dnd to implement smooth task transitions.',
    status: 'InReview',
    priority: 'Medium',
    type: 'Suggestion',
    projectId: '1',
    assignee: { name: 'Sarah Drasner', avatar: 'Sarah' },
    startDate: '2026-04-24',
    endDate: '2026-04-30',
    attachments: [],
    comments: [
      { id: 'c2', userId: '1', userName: 'Sarah', content: 'Great suggestion, this will really improve the UX.', timestamp: '3h ago' }
    ]
  },
  {
    id: '4',
    taskId: 'WEB-104',
    title: 'Auth Flow Refactor',
    description: 'Migrating to Refresh Tokens and secure cookie storage.',
    status: 'Done',
    priority: 'High',
    type: 'Feature',
    projectId: '1',
    assignee: { name: 'Alex Rivers', avatar: 'Alex' },
    startDate: '2026-04-18',
    endDate: '2026-04-22',
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    userId: "1",
    userName: "Sarah",
    userAvatar: "Sarah",
    action: "moved",
    target: "WEB-42",
    timestamp: "2m ago",
    type: "status_change",
  },
  {
    id: "2",
    userId: "2",
    userName: "John",
    userAvatar: "John",
    action: "commented on",
    target: "WEB-45",
    timestamp: "15m ago",
    type: "comment",
  },
  {
    id: "3",
    userId: "1",
    userName: "Sarah",
    userAvatar: "Sarah",
    action: "completed",
    target: "WEB-39",
    timestamp: "2h ago",
    type: "status_change",
  },
];
