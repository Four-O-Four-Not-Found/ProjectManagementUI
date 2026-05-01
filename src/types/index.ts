export type Role = "Admin" | "ProjectManager" | "Developer";

export interface User {
	id: string;
	email: string;
	displayName: string;
	role: Role;
	avatarUrl?: string;
	githubId?: string;
}

export type TaskStatus =
	| "Backlog"
	| "Todo"
	| "InProgress"
	| "InReview"
	| "Done";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type TaskType = "Feature" | "Bug" | "Suggestion" | "Issue";

export interface Attachment {
	id: string;
	url: string;
	name: string;
	type: "image" | "file";
	size: string;
}

export interface Comment {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	content: string;
	timestamp: string;
	attachments?: Attachment[];
}

export interface Task {
	id: string;
	taskId: string;
	title: string;
	description: string;
	status: TaskStatus;
	priority: Priority;
	type: TaskType;
	assigneeId?: string;
	projectId: string;
	githubPrUrl?: string;
	gitHubBranch?: string;
	hasGithub?: boolean;
	assignee?: {
		name: string;
		avatar: string;
	};
	startDate?: string;
	endDate?: string;
	progress?: number; // 0-100
	dependencies?: string[]; // IDs of tasks this task depends on
	attachments?: Attachment[];
	comments?: Comment[];
}

export interface Sprint {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	status: "Active" | "Completed" | "Future";
	taskCount: number;
	completedTasks: number;
	tasks?: Task[];
	goal?: string;
}

export interface Project {
	id: string;
	name: string;
	key: string;
	description: string;
	startDate?: string;
	endDate?: string;
	activeSprint?: Sprint;
	gitHubRepo?: string;
	teamId?: string;
	workspaceId?: string;
}

export interface Activity {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	action: string;
	target: string;
	timestamp: string;
	date?: string;
	type: "comment" | "status_change" | "system";
}
