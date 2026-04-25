import { createContext } from "react";
import type { ToastType } from "../components/atoms/Toast";

export interface ToastContextType {
	showToast: (
		title: string,
		type: ToastType,
		message?: string,
		duration?: number,
	) => void;
	success: (title: string, message?: string) => void;
	error: (title: string, message?: string) => void;
	warning: (title: string, message?: string) => void;
	info: (title: string, message?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
