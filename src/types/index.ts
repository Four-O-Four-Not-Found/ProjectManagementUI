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
	| "New"
	| "InProgress"
	| "ReadyForQA"
	| "QAFailed"
	| "Developed"
	| "Closed"
	| "OnHold";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type TaskType = "Feature" | "Bug" | "Suggestion" | "Issue";

export interface Attachment {
	id: string;
	fileName: string;
	fileUrl: string;
	fileType: string;
	fileSize: number;
	taskId: string;
	createdAt: string;
}

export interface Comment {
	id: string;
	content: string;
	userId: string;
	taskId: string;
	createdAt: string;
	user?: {
		id: string;
		displayName: string;
		avatarUrl?: string;
	};
}

export interface Repository {
	id: string;
	repoName: string;
	repoURL: string;
	ownerId: string;
	ownerType: "User" | "Team";
	projectId?: string;
}

export interface Task {
	id: string;
	taskKey: string; // ORN-1
	title: string;
	description: string;
	status: TaskStatus;
	priority: Priority;
	type: TaskType;
	projectId: string;
	sprintId?: string;
	repositoryId?: string;
	branchName?: string;
	assigneeId?: string;
	taskAssignees?: {
		user: {
			id: string;
			displayName: string;
			avatarUrl?: string;
		};
	}[];
	dueDate?: string;
	createdAt: string;
	updatedAt: string;
	parentTaskId?: string;
	subTasks?: Task[];
	// UI-only or future expansion fields
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
	status: string; // "Planned" | "Active" | "Completed"
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
	ownerId: string;
	ownerType: "User" | "Team";
	teamId?: string;
	status?: string;
	createdAt: string;
	updatedAt: string;
	repositories?: Repository[];
}

export interface Activity {
	id: string;
	action: string;
	target: string;
	createdAt: string;
	taskId?: string;
	userId?: string;
	projectId: string;
}

export interface Notification {
	id: string;
	userId: string;
	title: string;
	message: string;
	type: string;
	createdAt: string;
	isRead: boolean;
	link?: string;
	projectId?: string;
	taskId?: string;
}

export interface Team {
	id: string;
	name: string;
	description: string;
	githubOrgId?: string;
	avatarUrl?: string;
	inviteCode?: string;
	memberCount?: number;
	members?: {
		userId: string;
		name: string;
		email: string;
		role: string;
	}[];
}
