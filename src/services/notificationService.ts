import apiClient from "./apiClient";

export interface Notification {
	id: string;
	profileId: string;
	title: string;
	message: string;
	type: "General" | "TaskAssignment" | "Mention" | "System";
	createdAt: string;
	isRead: boolean;
	link?: string;
}

const notificationService = {
	getNotifications: async (): Promise<Notification[]> => {
		const response = await apiClient.get("/notifications");
		return response.data;
	},

	markAsRead: async (id: string): Promise<void> => {
		await apiClient.post(`/notifications/${id}/read`);
	},

	markAllAsRead: async (): Promise<void> => {
		await apiClient.post("/notifications/read-all");
	},
};

export default notificationService;
