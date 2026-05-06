import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import BaseModal from "../molecules/BaseModal";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import Switch from "../atoms/Switch";
import { Mail, GitBranch, LogOut, Bell, Settings2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import preferenceService, {
	type NotificationPreference,
} from "../../services/preferenceService";
import { useToast } from "../../hooks/useToast";

interface AccountModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
	const { user, logout } = useAuthStore();
	const { error } = useToast();
	const [prefs, setPrefs] = useState<NotificationPreference | null>(null);
	const [activeTab, setActiveTab] = useState<"profile" | "notifications">(
		"profile",
	);

	useEffect(() => {
		if (isOpen && user) {
			preferenceService.getPreferences(user.id).then(setPrefs);
		}
	}, [isOpen, user]);

	const handleToggle = async (
		key: keyof NotificationPreference,
		value: boolean,
	) => {
		if (!prefs || !user) return;
		const newPrefs = { ...prefs, [key]: value };
		setPrefs(newPrefs);

		try {
			await preferenceService.updatePreferences(user.id, newPrefs);
		} catch {
			error("Save Failed", "Could not update preferences.");
			setPrefs(prefs); // Rollback
		}
	};

	if (!user) return null;

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Account & Settings"
			size="md"
			footer={
				<div className="flex justify-between items-center w-full">
					<Button
						variant="danger"
						size="sm"
						leftIcon={<LogOut size={16} />}
						onClick={logout}
					>
						Sign Out
					</Button>
					<p className="text-[10px] text-text-muted italic">ID: {user.id}</p>
				</div>
			}
		>
			<div className="flex gap-6 min-h-[400px]">
				{/* Sidebar Tabs */}
				<div className="w-32 flex flex-col gap-2 border-r border-primary/30 pr-4">
					<button
						onClick={() => setActiveTab("profile")}
						className={twMerge(
							"flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-all",
							activeTab === "profile"
								? "bg-primary/10 text-primary"
								: "text-text-muted hover:bg-[var(--accent-primary)]/10",
						)}
					>
						<Settings2 size={14} /> Profile
					</button>
					<button
						onClick={() => setActiveTab("notifications")}
						className={twMerge(
							"flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-all",
							activeTab === "notifications"
								? "bg-primary/10 text-primary"
								: "text-text-muted hover:bg-[var(--accent-primary)]/10",
						)}
					>
						<Bell size={14} /> Alerts
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto pr-2 scrollbar-custom">
					{activeTab === "profile" ? (
						<div className="space-y-6">
							<div className="flex flex-col items-center gap-4 py-4">
								<Avatar
									src={user.avatarUrl}
									name={user.displayName}
									size="xl"
									className="w-24 h-24 border-4 border-primary/30"
								/>
								<div className="text-center">
									<h4 className="text-xl font-bold text-text-main">
										{user.displayName}
									</h4>
									<p className="text-sm text-text-muted">{user.role}</p>
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-center gap-3 p-3 bg-background border border-primary/30 rounded-xl">
									<Mail size={16} className="text-text-muted" />
									<div className="flex-1">
										<p className="text-[10px] font-bold text-text-muted uppercase">
											Email
										</p>
										<p className="text-xs text-text-main">{user.email}</p>
									</div>
								</div>

								<div className="flex items-center gap-3 p-3 bg-background border border-primary/30 rounded-xl">
									<GitBranch size={16} className="text-text-muted" />
									<div className="flex-1">
										<p className="text-[10px] font-bold text-text-muted uppercase">
											GitHub
										</p>
										<p className="text-xs text-text-main">
											@{user.githubId || "Not connected"}
										</p>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-6 animate-fade-in">
							<div>
								<h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
									Task Updates
								</h4>
								<div className="space-y-1 divide-y divide-border">
									<Switch
										checked={prefs?.emailOnTaskAssigned ?? false}
										onChange={(v) => handleToggle("emailOnTaskAssigned", v)}
										label="Email Notification"
										description="Receive email when a task is assigned to you."
									/>
									<Switch
										checked={prefs?.pushOnTaskAssigned ?? false}
										onChange={(v) => handleToggle("pushOnTaskAssigned", v)}
										label="Push Alerts"
										description="Real-time browser notifications for task assignments."
									/>
								</div>
							</div>

							<div>
								<h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
									Mentions
								</h4>
								<div className="space-y-1 divide-y divide-border">
									<Switch
										checked={prefs?.emailOnMention ?? false}
										onChange={(v) => handleToggle("emailOnMention", v)}
										label="Email on Mention"
										description="Get an email when someone @tags you."
									/>
									<Switch
										checked={prefs?.pushOnMention ?? false}
										onChange={(v) => handleToggle("pushOnMention", v)}
										label="Push on Mention"
										description="Real-time alerts when you are mentioned."
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</BaseModal>
	);
};

export default AccountModal;
