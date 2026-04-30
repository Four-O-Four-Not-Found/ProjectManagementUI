import apiClient from "./apiClient";

export interface NotificationPreference {
	id: string;
	profileId: string;
	emailOnTaskAssigned: boolean;
	pushOnTaskAssigned: boolean;
	emailOnMention: boolean;
	pushOnMention: boolean;
	emailOnProjectUpdate: boolean;
	pushOnProjectUpdate: boolean;
}

const preferenceService = {
	getPreferences: async (profileId: string): Promise<NotificationPreference> => {
		const response = await apiClient.get(`/preferences/${profileId}`);
		return response.data;
	},

	updatePreferences: async (profileId: string, prefs: NotificationPreference): Promise<void> => {
		await apiClient.put(`/preferences/${profileId}`, prefs);
	},
};

export default preferenceService;
