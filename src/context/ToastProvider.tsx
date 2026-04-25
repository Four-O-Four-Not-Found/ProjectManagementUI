import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Toast from "../components/atoms/Toast";
import type { ToastMessage, ToastType } from "../components/atoms/Toast";
import { ToastContext } from "./ToastContextInstance";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const showToast = useCallback(
		(title: string, type: ToastType, message?: string, duration?: number) => {
			const id = Math.random().toString(36).substr(2, 9);
			setToasts((prev) => [...prev, { id, title, type, message, duration }]);
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const success = (title: string, message?: string) =>
		showToast(title, "success", message);
	const error = (title: string, message?: string) =>
		showToast(title, "error", message);
	const warning = (title: string, message?: string) =>
		showToast(title, "warning", message);
	const info = (title: string, message?: string) =>
		showToast(title, "info", message);

	return (
		<ToastContext.Provider value={{ showToast, success, error, warning, info }}>
			{children}
			<div className="fixed bottom-0 right-0 p-6 flex flex-col gap-4 z-[1000] pointer-events-none">
				<AnimatePresence mode="popLayout">
					{toasts.map((toast) => (
						<Toast key={toast.id} toast={toast} onClose={removeToast} />
					))}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
};
