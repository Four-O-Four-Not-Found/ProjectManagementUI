import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "https://api.FlowState.com",
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor for adding auth token
apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default apiClient;
