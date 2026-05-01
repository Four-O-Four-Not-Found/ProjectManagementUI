import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	User,
	Mail,
	Lock,
	Bell,
	Save,
	LogOut,
	Palette,
	Smartphone,
	Monitor,
	Moon,
	Sun,
	Check,
	ShieldCheck,
	Key,
} from "lucide-react";
import PageHeader from "../components/molecules/PageHeader";
import GlassCard from "../components/molecules/GlassCard";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import { useAuthStore } from "../store/useAuthStore";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../hooks/useTheme";
import type { Theme } from "../context/ThemeContext";
import { twMerge } from "tailwind-merge";

type SettingsTab = "Profile" | "Notifications" | "Security" | "Appearance";

const Settings: React.FC = () => {
	const { user, logout } = useAuthStore();
	const { success } = useToast();
	const { theme: currentTheme, setTheme } = useTheme();
	const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");

	const [displayName, setDisplayName] = useState(user?.displayName || "Member");
	const [email, setEmail] = useState(user?.email || "member@example.com");

	const [isCompact, setIsCompact] = useState(
		() => localStorage.getItem("ui-compact") === "true",
	);
	const [glassIntensity, setGlassIntensity] = useState(
		() => localStorage.getItem("ui-glass") || "High",
	);

	useEffect(() => {
		localStorage.setItem("ui-compact", isCompact.toString());
		if (isCompact) {
			document.documentElement.classList.add("compact-mode");
		} else {
			document.documentElement.classList.remove("compact-mode");
		}
	}, [isCompact]);

	useEffect(() => {
		localStorage.setItem("ui-glass", glassIntensity);
		document.documentElement.setAttribute(
			"data-glass",
			glassIntensity.toLowerCase(),
		);
	}, [glassIntensity]);

	const handleSave = () => {
		success(
			"Settings Saved",
			"Your preferences have been updated successfully.",
		);
	};

	const renderContent = () => {
		switch (activeTab) {
			case "Profile":
				return (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-6"
					>
						<GlassCard className="p-8">
							<div className="flex flex-col md:flex-row items-center gap-8 mb-8">
								<div className="relative group">
									<Avatar
										name={displayName}
										size="xl"
										className="ring-4 ring-primary/20"
									/>
									<div className="absolute inset-0 bg-black/40 rounded-[24px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
										<Smartphone size={20} className="text-white" />
									</div>
								</div>
								<div className="text-center md:text-left">
									<h4 className="text-xl font-black text-text-main">
										{displayName}
									</h4>
									<p className="text-xs text-text-muted mb-2">{email}</p>
									<Button variant="secondary" size="xs">
										Change Avatar
									</Button>
								</div>
							</div>

							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
											Display Name
										</label>
										<div className="relative">
											<User
												className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
												size={16}
											/>
											<input
												type="text"
												value={displayName}
												onChange={(e) => setDisplayName(e.target.value)}
												className="w-full bg-background border border-border rounded-lg pl-10 p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
											Email Address
										</label>
										<div className="relative">
											<Mail
												className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
												size={16}
											/>
											<input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="w-full bg-background border border-border rounded-lg pl-10 p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
											/>
										</div>
									</div>
								</div>
								<div className="space-y-2">
									<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
										Bio
									</label>
									<textarea
										rows={3}
										placeholder="Tell us about yourself..."
										className="w-full bg-background border border-border rounded-lg p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors resize-none"
									/>
								</div>
							</div>
						</GlassCard>
					</motion.div>
				);
			case "Notifications":
				return (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-6"
					>
						<GlassCard className="p-6">
							<h4 className="text-sm font-bold text-text-main mb-6">
								Notification Preferences
							</h4>
							<div className="space-y-4">
								{[
									{
										label: "Real-time Updates",
										desc: "Browser push notifications for task moves.",
										enabled: true,
									},
									{
										label: "Email Summaries",
										desc: "Daily digest of project progress.",
										enabled: false,
									},
									{
										label: "Team Mentions",
										desc: "Notify when you are tagged in a comment.",
										enabled: true,
									},
									{
										label: "Sprint Reminders",
										desc: "Alerts for upcoming sprint deadlines.",
										enabled: true,
									},
								].map((pref) => (
									<div
										key={pref.label}
										className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-xl"
									>
										<div>
											<p className="text-xs font-bold text-text-main">
												{pref.label}
											</p>
											<p className="text-[10px] text-text-muted">{pref.desc}</p>
										</div>
										<button
											className={twMerge(
												"w-10 h-5 rounded-full relative transition-all",
												pref.enabled
													? "bg-success shadow-[0_0_10px_rgba(34,197,94,0.3)]"
													: "bg-border",
											)}
										>
											<div
												className={twMerge(
													"absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
													pref.enabled ? "right-1" : "left-1",
												)}
											/>
										</button>
									</div>
								))}
							</div>
						</GlassCard>
					</motion.div>
				);
			case "Security":
				return (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-6"
					>
						<GlassCard className="p-6">
							<h4 className="text-sm font-bold text-text-main mb-6">
								Security Settings
							</h4>
							<div className="space-y-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
											Current Password
										</label>
										<div className="relative">
											<Key
												className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
												size={16}
											/>
											<input
												type="password"
												placeholder="••••••••"
												className="w-full bg-background border border-border rounded-lg pl-10 p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
											/>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
												New Password
											</label>
											<input
												type="password"
												placeholder="Min 8 characters"
												className="w-full bg-background border border-border rounded-lg p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
												Confirm New Password
											</label>
											<input
												type="password"
												placeholder="Confirm"
												className="w-full bg-background border border-border rounded-lg p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
											/>
										</div>
									</div>
								</div>

								<div className="pt-6 border-t border-border flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
											<ShieldCheck size={20} />
										</div>
										<div>
											<p className="text-xs font-bold text-text-main">
												Two-Factor Authentication
											</p>
											<p className="text-[10px] text-text-muted">
												Add an extra layer of security.
											</p>
										</div>
									</div>
									<Button variant="secondary" size="xs">
										Enable 2FA
									</Button>
								</div>
							</div>
						</GlassCard>
					</motion.div>
				);
			case "Appearance":
				return (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-6"
					>
						<GlassCard className="p-6">
							<h4 className="text-sm font-bold text-text-main mb-6">
								Theme Preference
							</h4>
							<div className="grid grid-cols-3 gap-4">
								{[
									{ id: "light" as Theme, icon: Sun, label: "Light" },
									{ id: "dark" as Theme, icon: Moon, label: "Dark" },
									{ id: "system" as Theme, icon: Monitor, label: "System" },
								].map((t) => (
									<button
										key={t.id}
										onClick={() => setTheme(t.id)}
										className={twMerge(
											"flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all group",
											currentTheme === t.id
												? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
												: "bg-background border-border hover:border-border-hover",
										)}
									>
										<t.icon
											size={24}
											className={
												currentTheme === t.id
													? "text-primary"
													: "text-text-muted group-hover:text-text-main"
											}
										/>
										<span
											className={twMerge(
												"text-[10px] font-bold uppercase",
												currentTheme === t.id
													? "text-primary"
													: "text-text-muted group-hover:text-text-main",
											)}
										>
											{t.label}
										</span>
										{currentTheme === t.id && (
											<div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white">
												<Check size={10} />
											</div>
										)}
									</button>
								))}
							</div>
						</GlassCard>
						<GlassCard className="p-6">
							<h4 className="text-sm font-bold text-text-main mb-4">
								UI Density
							</h4>
							<div className="space-y-3">
								<button
									onClick={() => setIsCompact(!isCompact)}
									className="w-full flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-primary transition-colors"
								>
									<span className="text-xs text-text-main">Compact Mode</span>
									<div
										className={twMerge(
											"w-10 h-5 rounded-full relative transition-all",
											isCompact ? "bg-success" : "bg-border",
										)}
									>
										<div
											className={twMerge(
												"absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
												isCompact ? "right-1" : "left-1",
											)}
										/>
									</div>
								</button>
								<div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
									<span className="text-xs text-text-main">
										Glassmorphism Intensity
									</span>
									<div className="flex gap-2">
										{["Low", "Medium", "High"].map((level) => (
											<button
												key={level}
												onClick={() => setGlassIntensity(level)}
												className={twMerge(
													"px-2 py-1 rounded text-[10px] font-bold transition-all",
													glassIntensity === level
														? "bg-primary text-white"
														: "bg-surface border border-border text-text-muted hover:text-text-main",
												)}
											>
												{level}
											</button>
										))}
									</div>
								</div>
							</div>
						</GlassCard>
					</motion.div>
				);
		}
	};

	return (
		<div className="space-y-8 animate-fade-in pb-20 max-w-5xl mx-auto px-4 md:px-0">
			<PageHeader
				title="Global Settings"
				description="Customize your workspace experience and security preferences."
			/>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* Navigation Sidebar */}
				<div className="md:col-span-1 space-y-2">
					{[
						{ id: "Profile", icon: User, label: "Profile" },
						{ id: "Notifications", icon: Bell, label: "Notifications" },
						{ id: "Security", icon: Lock, label: "Security" },
						{ id: "Appearance", icon: Palette, label: "Appearance" },
					].map((item) => (
						<button
							key={item.id}
							onClick={() => setActiveTab(item.id as SettingsTab)}
							className={twMerge(
								"w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold border-2",
								activeTab === item.id
									? "bg-primary text-white border-primary shadow-xl shadow-primary/20"
									: "text-text-muted bg-surface/30 border-transparent hover:bg-surface hover:border-border",
							)}
						>
							<item.icon size={18} />
							{item.label}
						</button>
					))}

					<div className="pt-8 mt-8 border-t border-border">
						<button
							onClick={logout}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-danger hover:bg-danger/10 group"
						>
							<LogOut
								size={18}
								className="group-hover:-translate-x-1 transition-transform"
							/>
							Logout Session
						</button>
					</div>
				</div>

				{/* Tab Content */}
				<div className="md:col-span-3 space-y-8">
					<div className="flex items-center justify-between px-1">
						<h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
							{activeTab} Management
						</h3>
						{activeTab !== "Appearance" && (
							<Button
								variant="primary"
								size="xs"
								leftIcon={<Save size={14} />}
								onClick={handleSave}
							>
								Save Changes
							</Button>
						)}
					</div>

					{renderContent()}
				</div>
			</div>
		</div>
	);
};

export default Settings;
