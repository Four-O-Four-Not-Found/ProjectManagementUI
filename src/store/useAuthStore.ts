import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../services/authService";

interface User {
	id: string;
	email: string;
	displayName: string;
	role: "Admin" | "ProjectManager" | "Developer";
	avatarUrl?: string;
	githubId?: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	setAuth: (user: User, token: string) => void;
	setToken: (token: string) => void;
	logout: () => void;
}

interface JwtPayload {
	nameid?: string;
	email?: string;
	unique_name?: string;
	AvatarUrl?: string;
	GitHubId?: string;
	[key: string]: unknown;
}

function decodeToken(token: string): JwtPayload | null {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join(""),
		);

		return JSON.parse(jsonPayload) as JwtPayload;
	} catch {
		return null;
	}
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
			setToken: (token) => {
				const decoded = decodeToken(token);
				if (decoded) {
					const user: User = {
						id: (decoded.nameid ||
							decoded[
								"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
							]) as string,
						email: (decoded.email ||
							decoded[
								"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
							]) as string,
						displayName: (decoded.unique_name ||
							decoded[
								"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
							]) as string,
						avatarUrl: decoded.AvatarUrl as string,
						githubId: decoded.GitHubId as string,
						role: "Developer",
					};
					set({ user, token, isAuthenticated: true });
				} else {
					set({ user: null, token: null, isAuthenticated: false });
				}
			},
			logout: () => {
				authService.logout(); // Trigger backend logout
				set({ user: null, token: null, isAuthenticated: false });
			},
		}),
		{
			name: "auth-storage",
		},
	),
);
