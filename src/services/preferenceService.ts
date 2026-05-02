import apiClient from "./apiClient";

export interface NotificationPreference {
	id: string;
	userId: string;
	emailOnTaskAssigned: boolean;
	pushOnTaskAssigned: boolean;
	emailOnMention: boolean;
	pushOnMention: boolean;
	emailOnProjectUpdate: boolean;
	pushOnProjectUpdate: boolean;
}

const preferenceService = {
	getPreferences: async (userId: string): Promise<NotificationPreference> => {
		const response = await apiClient.get(`/preferences/${userId}`);
		return response.data;
	},

	updatePreferences: async (userId: string, prefs: NotificationPreference): Promise<void> => {
		await apiClient.put(`/preferences/${userId}`, prefs);
	},
};

export default preferenceService;
