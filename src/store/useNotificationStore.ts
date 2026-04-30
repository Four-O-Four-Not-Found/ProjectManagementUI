import { create } from "zustand";
import notificationService, { type Notification } from "../services/notificationService";

interface NotificationState {
	notifications: Notification[];
	unreadCount: number;
	loading: boolean;
	fetchNotifications: () => Promise<void>;
	addNotification: (notification: Notification) => void;
	markAsRead: (id: string) => Promise<void>;
	markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
	notifications: [],
	unreadCount: 0,
	loading: false,

	fetchNotifications: async () => {
		set({ loading: true });
		try {
			const data = await notificationService.getNotifications();
			set({
				notifications: data,
				unreadCount: data.filter((n) => !n.isRead).length,
			});
		} finally {
			set({ loading: false });
		}
	},

	addNotification: (notification) => {
		set((state) => ({
			notifications: [notification, ...state.notifications],
			unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
		}));
	},

	markAsRead: async (id) => {
		try {
			await notificationService.markAsRead(id);
			set((state) => ({
				notifications: state.notifications.map((n) =>
					n.id === id ? { ...n, isRead: true } : n
				),
				unreadCount: Math.max(0, state.unreadCount - 1),
			}));
		} catch (err) {
			console.error("Failed to mark notification as read", err);
		}
	},

	markAllAsRead: async () => {
		try {
			await notificationService.markAllAsRead();
			set((state) => ({
				notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
				unreadCount: 0,
			}));
		} catch (err) {
			console.error("Failed to mark all as read", err);
		}
	},
}));
