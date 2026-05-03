import React, { useState, useCallback, useMemo } from "react";
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

	const success = useCallback((title: string, message?: string) =>
		showToast(title, "success", message), [showToast]);
	const error = useCallback((title: string, message?: string) =>
		showToast(title, "error", message), [showToast]);
	const warning = useCallback((title: string, message?: string) =>
		showToast(title, "warning", message), [showToast]);
	const info = useCallback((title: string, message?: string) =>
		showToast(title, "info", message), [showToast]);

	const contextValue = useMemo(() => ({ showToast, success, error, warning, info }), [showToast, success, error, warning, info]);

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
			<div className="fixed bottom-0 right-0 p-6 flex flex-col gap-4 z-[20000] pointer-events-none">
				<AnimatePresence mode="popLayout">
					{toasts.map((toast) => (
						<Toast key={toast.id} toast={toast} onClose={removeToast} />
					))}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
};
