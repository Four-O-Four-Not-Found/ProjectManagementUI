import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
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

// Interceptor for handling 401 errors
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Clear auth storage and redirect to login
			localStorage.removeItem("auth-storage");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export default apiClient;
