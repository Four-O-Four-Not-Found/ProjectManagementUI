import type { Task, TaskStatus, TaskType, Project } from "../types";
import { signalRService } from "./signalRService";

// Mock data
const MOCK_TASKS: Task[] = [
	{
		id: "1",
		taskId: "WEB-101",
		title: "Implement Dark Mode Water-morphism",
		description:
			"Create a high-fidelity glassmorphism effect using Tailwind v4 and dynamic gradients.",
		status: "Todo",
		priority: "High",
		type: "Feature",
		projectId: "1",
		assignee: { name: "Sarah Drasner", avatar: "Sarah" },
		attachments: [
			{
				id: "att-1",
				name: "Design Spec",
				type: "image",
				url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop",
				size: "1.2MB",
			},
		],
		comments: [
			{
				id: "c1",
				userId: "2",
				userName: "John",
				content: "We should ensure the blur-radius is at least 20px.",
				timestamp: "1h ago",
			},
		],
	},
	{
		id: "2",
		taskId: "WEB-102",
		title: "SignalR Connection Latency",
		description:
			"Users are reporting 500ms+ latency during peak hours on the websocket connection.",
		status: "InProgress",
		priority: "Urgent",
		type: "Issue",
		projectId: "1",
		assignee: { name: "Dan Abramov", avatar: "Dan" },
		attachments: [
			{
				id: "att-2",
				name: "Latency Graph",
				type: "image",
				url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
				size: "800KB",
			},
		],
	},
	{
		id: "3",
		taskId: "WEB-103",
		title: "Add Drag and Drop to Board",
		description:
			"Use dnd-kit or react-beautiful-dnd to implement smooth task transitions.",
		status: "InReview",
		priority: "Medium",
		type: "Suggestion",
		projectId: "1",
		attachments: [],
		comments: [
			{
				id: "c2",
				userId: "1",
				userName: "Sarah",
				content: "Great suggestion, this will really improve the UX.",
				timestamp: "3h ago",
			},
		],
	},
];

const MOCK_PROJECTS: Project[] = [
	{
		id: "1",
		name: "FlowState Platform",
		key: "WEB",
		description: "Core project management platform",
	},
];

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
