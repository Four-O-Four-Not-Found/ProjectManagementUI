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

export interface Repository {
	id: string;
	name: string;
	url: string;
	gitHubRepoId?: number;
	projectId: string;
}

export interface Task {
	id: string;
	taskId: string; // This is the TaskKey (e.g. ORN-1)
	title: string;
	description: string;
	status: TaskStatus;
	priority: Priority;
	type: TaskType;
	assigneeId?: string;
	projectId: string;
	columnId: string;
	sprintId?: string;
	repositoryId?: string;
	gitHubBranch?: string;
	startDate?: string;
	dueDate?: string;
	createdAt: string;
	updatedAt: string;
	assignee?: {
		name: string;
		avatar: string;
	};
	parentTaskId?: string;
	subTasks?: Task[];
	// UI-only or future expansion fields (not yet in schema)
	progress?: number;
	attachments?: Attachment[];
	comments?: Comment[];
	dependencies?: string[];
}

export interface Sprint {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	status: "Active" | "Completed" | "Future";
	projectId: string;
	taskCount?: number;
	completedTasks?: number;
	tasks?: Task[];
}

export interface Project {
	id: string;
	name: string;
	key: string;
	description: string;
	workspaceId: string;
	teamId?: string;
	createdAt: string;
	updatedAt: string;
	repositories?: Repository[];
}
export interface Repository {
	id: string;
	name: string;
	url: string;
	projectId: string;
	createdAt: string;
}

export interface Activity {
	id: string;
	action: string;
	target: string;
	timestamp: string;
	taskId?: string;
	userId?: string;
	projectId: string;
}

export interface Notification {
	id: string;
	profileId: string;
	title: string;
	message: string;
	type: string;
	createdAt: string;
	isRead: boolean;
	link?: string;
	projectId?: string;
	taskId?: string;
}
