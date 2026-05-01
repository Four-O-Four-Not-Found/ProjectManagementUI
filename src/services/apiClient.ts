import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5139/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor for adding auth token
apiClient.interceptors.request.use((config) => {
	const authStorage = localStorage.getItem("auth-storage");
	if (authStorage) {
		try {
			const { state } = JSON.parse(authStorage);
			if (state.token) {
				config.headers.Authorization = `Bearer ${state.token}`;
			}
		} catch (e) {
			console.error("Failed to parse auth-storage", e);
		}
	}
	return config;
});

export default apiClient;
