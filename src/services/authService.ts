import axios from "axios";
import type { User } from "../types";

const API_URL = "http://localhost:5139/api/auth";

const authService = {
	// Existing login remains mock for now as it's handled via GitHub redirect
	login: async (
		credentials: Record<string, unknown>,
	): Promise<{ user: User; token: string }> => {
		console.log("Logging in with:", credentials);
		return Promise.reject("Standard login disabled. Use GitHub.");
	},

	logout: async (): Promise<void> => {
		try {
			const storage = localStorage.getItem("auth-storage");
			const token = storage ? JSON.parse(storage).state?.token : null;

			await axios.post(
				`${API_URL}/logout`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
		} catch (err) {
			console.error("Backend logout failed:", err);
		}
	},
};

export default authService;
