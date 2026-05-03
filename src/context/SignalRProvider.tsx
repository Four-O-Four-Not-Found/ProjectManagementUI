import React, { useEffect } from "react";
import { signalRService } from "../services/signalRService";
import { useToast } from "../hooks/useToast";
import { SignalRContext } from "./SignalRContext";
import { useNotificationStore } from "../store/useNotificationStore";
import { type Notification } from "../services/notificationService";
import { useAuthStore } from "../store/useAuthStore";

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { info, success } = useToast();
	const { addNotification } = useNotificationStore();
	const { isAuthenticated } = useAuthStore();

	useEffect(() => {
		if (!isAuthenticated) return;

		let isSubscribed = true;

		const init = async () => {
			try {
				await signalRService.startConnection();

				if (!isSubscribed) return;

				// Setup global listeners
				signalRService.on("ReceiveNotification", (data) => {
					const notification = data as Notification;
					addNotification(notification);
					success(notification.title, notification.message);
				});

				signalRService.on("TaskUpdated", (data) => {
					const payload = data as { taskId: string };
					if (payload?.taskId) {
						info("Live Sync", `Task ${payload.taskId} was updated.`);
					}
				});
 
				const handleTaskAssigned = () => {
					success("Task Assigned", "Team member joined a task.");
				};
 
				signalRService.on("TaskAssigned", handleTaskAssigned);
				signalRService.on("taskassigned", handleTaskAssigned);
			} catch {
				console.debug("SignalR initialization bypassed during reload.");
			}
		};

		init();

		return () => {
			isSubscribed = false;
			// Small delay before stopping to allow any pending start/negotiation to settle
			// This is a common workaround for StrictMode rapid cycles
			setTimeout(() => {
				signalRService.stopConnection();
			}, 100);
		};
	}, [isAuthenticated, info, success, addNotification]);

	return (
		<SignalRContext.Provider value={{ service: signalRService }}>
			{children}
		</SignalRContext.Provider>
	);
};
